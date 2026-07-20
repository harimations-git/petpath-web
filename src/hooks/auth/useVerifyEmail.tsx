import {
    useEffect,
    useState,
    type SubmitEvent,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    autoSignIn,
    confirmSignUp,
    getCurrentUser,
    resendSignUpCode,
    signIn,
} from "aws-amplify/auth";

import {routes} from "../../constants/routes";

type VerifyEmailState = {
    email?: string;
    password?: string;
    accountType?: "shelter";
    fromLogin?: boolean;
};

const CODE_LENGTH = 6;

export function useVerifyEmail() {
    const navigate = useNavigate();

    //gets info like current route
    const location = useLocation();
    //read th route state
    const state = (location.state ?? {}) as VerifyEmailState;

    //get the email from route state first then do empty
    const email = state.email ?? sessionStorage.getItem("pendingVerificationEmail") ?? "";
    const passwordForSignIn = state.password ?? "";
    const [verificationCode, setVerificationCode] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        document.title = "Verify Email | PetPath";
    }, []);

    //navigate to login page
    function goToLogin() {
        navigate(routes.auth.login);
    }

    //go to account review page
    function goToAccountReview() {
        //no longer needed so remove it from session storage
        sessionStorage.removeItem("pendingVerificationEmail");

        navigate(routes.auth.accountReview, {
            replace: true,
            state: {
                message: "Email verified. Your shelter account is now pending manual review.",
                accountType: "shelter",
            },
        });
    }

    function goToLoginAfterVerification() {
        //no longer needed so remove it from session storage
        sessionStorage.removeItem("pendingVerificationEmail");

        navigate(routes.auth.login, {
            replace: true,
            state: {
                message: "Email verified. Please log in to continue.",
                accountType: "shelter",
            },
        });
    }

    async function handleVerifyEmail(
        event: SubmitEvent<HTMLFormElement>
    ) {
        //prevents the browser from refreshing
        event.preventDefault();

        setFormError("");
        setSuccessMessage("");

        const normalisedEmail = email.trim().toLowerCase();

        if (!normalisedEmail) {
            setFormError("No email address was found. Please register again.");
            return;
        }

        if (verificationCode.length !== CODE_LENGTH) {
            setFormError("Please enter the 6-digit verification code.");
            return;
        }

        try {
            setIsLoading(true);

            const confirmResult =
                await confirmSignUp({
                    username: normalisedEmail,
                    confirmationCode: verificationCode,
                });

            /*
             * The user may already be authenticated.
             * In that case, do not call autoSignIn or signIn again.
             */
            try {
                await getCurrentUser();

                goToAccountReview();
                return;
            } catch {
                // No existing session, continue with sign-in flow.
            }

            /*
             * User arrived from the login page.
             * Confirm the email and then sign in using the password
             * they entered on the login page.
             */
            if (passwordForSignIn) {
                const signInResult =
                    await signIn({
                        username: normalisedEmail,
                        password: passwordForSignIn,
                    });

                if (!signInResult.isSignedIn) {
                    throw new Error("Your email was verified, but sign-in was not completed."
                    );
                }

                goToAccountReview();
                return;
            }

            /*
             * User arrived directly from registration.
             * Only call autoSignIn when Cognito explicitly requests it.
             */
            if (
                confirmResult.nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN"
            ) {
                try {
                    const autoSignInResult = await autoSignIn();

                    if (!autoSignInResult.isSignedIn) {
                        throw new Error("Automatic sign-in was not completed.");
                    }

                    goToAccountReview();
                    return;
                } catch (error) {
                    const errorName = error instanceof Error ? error.name : "";

                    /*
                     * This means the user is already signed in,
                     * so they can continue to the review page.
                     */
                    if (
                        errorName === "UserAlreadyAuthenticatedException"
                    ) {
                        goToAccountReview();
                        return;
                    }

                    throw error;
                }
            }

            /*
             * Email was confirmed, but there is no active sign-in flow.
             * Send the user to login.
             */
            goToLoginAfterVerification();
        } catch (error) {
            console.log( "Verify email error:", error
            );

            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError(
                    "Unable to verify your email. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResendCode() {
        setFormError("");
        setSuccessMessage("");

        const normalisedEmail = email.trim().toLowerCase();

        if (!normalisedEmail) {
            setFormError("No email address was found. Please register again."
            );
            return;
        }

        try {
            setIsResending(true);

            await resendSignUpCode({username: normalisedEmail,});

            setSuccessMessage("A new verification code has been sent to your email.");
        } catch (error) {
            console.log("Resend code error:", error);

            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("Unable to resend the code. Please try again.");
            }
        } finally {
            setIsResending(false);
        }
    }

    return {
        email,

        verificationCode,
        setVerificationCode,

        codeLength: CODE_LENGTH,

        isLoading,
        isResending,

        formError,
        successMessage,

        handleVerifyEmail,
        handleResendCode,
        goToLogin,
    };
}
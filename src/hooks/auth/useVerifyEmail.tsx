import { useEffect, useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmSignUp, resendSignUpCode, signIn, signOut } from "aws-amplify/auth";
import { routes } from "../../constants/routes";

/**
 * Route state that can be passed into the email verification page.
 */
type VerifyEmailState = {
    email?: string;
    password?: string;
    accountType?: "shelter";
    fromLogin?: boolean;
};

// Cognito verification codes contain six digits
const CODE_LENGTH = 6;

/**
 * Manages the shelter email verification flow.
 * Handles code confirmation, resending codes and navigation after verification.
 */
export function useVerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    //Read any verification details passed through the route state
    const state = (location.state ?? {}) as VerifyEmailState;

    /*
     * Use the email from the route state when available,
     * otherwise fall back to the value stored in session storage.
     */
    const email = state.email ?? sessionStorage.getItem("pendingVerificationEmail") ?? "";

     // Password may be available when arriving directly from registration or login
    const passwordForSignIn = state.password ?? "";

    const [verificationCode, setVerificationCode] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        document.title = "Verify Email | PetPath";
    }, []);

    //Navigate to login page
    function goToLogin() {
        navigate(routes.auth.login);
    }

    //Send a newly verified shelter account to the manual review page
    function goToAccountReview() {

        //The stored email is no longer needed after verification
        sessionStorage.removeItem("pendingVerificationEmail");

        navigate(routes.auth.accountReview, {
            replace: true,
            state: {
                message: "Email verified. Your shelter account is now pending manual review.",
                accountType: "shelter",
            },
        });
    }

    //Return the user to login when automatic sign-in is not possible
    function goToLoginAfterVerification() {
        
        sessionStorage.removeItem("pendingVerificationEmail");

        navigate(routes.auth.login, {
            replace: true,
            state: {
                message: "Email verified. Please log in to continue.",
                accountType: "shelter",
            },
        });
    }

    //Confirm the verification code and complete the verification flow
    async function handleVerifyEmail(event: SubmitEvent<HTMLFormElement>) {
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

            await confirmSignUp({username: normalisedEmail, confirmationCode: verificationCode});

            /*
             * Clear any existing session first.
             * This prevents an old admin or shelter session
             * from being reused.
             */
            await signOut();

            /*
             * If the password is available, explicitly sign
             * into the account that was just verified.
             */
            if (passwordForSignIn) {
                const signInResult = await signIn({
                    username: normalisedEmail,
                    password: passwordForSignIn,
                });

                if (!signInResult.isSignedIn) {
                    throw new Error("Your email was verified, but sign-in was not completed.");
                }

                goToAccountReview();
                return;
            }

            /*
             * If the password is unavailable, require the
             * user to log in normally.
             */
            goToLoginAfterVerification();

        } catch (error) {
            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("Unable to verify your email. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    //Request a new verification code from Cognito
    async function handleResendCode() {
        setFormError("");
        setSuccessMessage("");

        const normalisedEmail = email.trim().toLowerCase();

        if (!normalisedEmail) {
            setFormError("No email address was found. Please register again.");
            return;
        }

        try {
            setIsResending(true);

            await resendSignUpCode({ username: normalisedEmail, });

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
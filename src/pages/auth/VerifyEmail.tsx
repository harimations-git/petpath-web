import { useEffect, useState, type FormEvent } from "react";
import { confirmSignUp, resendSignUpCode, autoSignIn, signIn, getCurrentUser } from "aws-amplify/auth";

import { ArrowLeft } from "lucide-react";

import Logo from "../../components/ui/Logo";
import Card from "../../components/ui/Card";

import CustomButton from "../../components/ui/CustomButton";
import ImageSlideShow from "../../components/ui/ImageSlideShow";

import Spacer from "../../components/layout/Spacer";
import { loginSlideshowContent } from "../../data/imageContent";

import "./RegisterShelter.css"; //Basically the same css
import "./VerifyEmail.css";

import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

import AuthProgressStepper from "../../components/ui/auth/AuthProgressStepper";
import verificationImageUrl from "../../assets/EmailVerification.png";
import VerificationImage from "../../assets/EmailVerification.png";
import DecorativeLeaf from "../../components/ui/DecorativeLeaf";
import VerificationCodeInput from "../../components/ui/auth/VerificationCodeInput";

type VerifyEmailState = {
    email?: string;
    password?: string;
    accountType?: "shelter";
    fromLogin?: boolean;
};

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    const state = (location.state ?? {}) as VerifyEmailState;
    const email = state.email ?? sessionStorage.getItem("pendingVerificationEmail") ?? "";
    const passwordFromLogin = state.password ?? "";
    const fromLogin = state.fromLogin ?? false;

    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const codeLength = 6;

    useEffect(() => {
        document.title = "Verify Email | PetPath";

        const img = new Image();
        img.src = verificationImageUrl;
    }, []);

    async function handleVerifyEmail(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setFormError("");
        setSuccessMessage("");

        const normalisedEmail = email.trim().toLowerCase();

        if (!normalisedEmail) {
            setFormError("No email address was found. Please register again.");
            return;
        }

        if (verificationCode.length !== codeLength) {
            setFormError("Please enter the 6-digit verification code.");
            return;
        }

        function goToAccountReview() {
            sessionStorage.removeItem("pendingVerificationEmail");

            navigate(routes.auth.accountReview, {
                replace: true,
                state: {
                    message:
                        "Email verified. Your shelter account is now pending manual review.",
                    accountType: "shelter",
                },
            });
        }

        try {
            setIsLoading(true);

            const confirmResult = await confirmSignUp({
                username: normalisedEmail,
                confirmationCode: verificationCode,
            });

            console.log("Confirm sign-up result:", confirmResult);

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
            if (fromLogin && passwordFromLogin) {
                const signInResult = await signIn({
                    username: normalisedEmail,
                    password: passwordFromLogin,
                });

                if (!signInResult.isSignedIn) {
                    throw new Error("Your email was verified, but sign-in was not completed.");
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
                    const errorName =
                        error instanceof Error ? error.name : "";

                    /*
                     * This means the user is already signed in,
                     * so they can continue to the review page.
                     */
                    if (errorName === "UserAlreadyAuthenticatedException") {
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
            sessionStorage.removeItem("pendingVerificationEmail");

            navigate(routes.auth.login, {
                replace: true,
                state: {
                    message: "Email verified. Please log in to continue.",
                    accountType: "shelter",
                },
            });
        } catch (error) {
            console.log("Verify email error:", error);

            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError("Unable to verify your email. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResendCode() {
        setFormError("");
        setSuccessMessage("");

        if (!email) {
            setFormError("No email address was found. Please register again.");
            return;
        }

        try {
            setIsResending(true);

            await resendSignUpCode({
                username: email.trim().toLowerCase(),
            });

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

    return (
        <main className="register-shelter-page">
            <section className="register-shelter-left">
                <DecorativeLeaf top={18} left={0} rotate={90} width={230} height={230} />
                <DecorativeLeaf bottom={-70} right={70} rotate={-60} flipX width={230} height={230} />

                <button
                    type="button"
                    className="account-type-back"
                    onClick={() => { navigate(routes.auth.login) }}
                >
                    <ArrowLeft size={22} />
                </button>

                <Logo hasTagline size="md" />

                <Spacer height={8} />

                <Card className="register-shelter-card">
                    <AuthProgressStepper
                        currentStep={2}
                        steps={[
                            { label: "Account" },
                            { label: "Verify Email" },
                            { label: "Review" },
                        ]}
                    />
                    <h1 className="register-shelter-title">Verify Your Email</h1>

                    <p className="register-shelter-description">
                        We’ve sent you a 6-digit verification code to {email}.{"\n"} Please enter your code below.
                    </p>


                    <form className="register-shelter-form" onSubmit={handleVerifyEmail}>
                        <div className="verify-email-image-wrapper">
                            <img
                                className="verify-email-image"
                                src={VerificationImage}
                                alt="Email verification"
                                loading="eager"
                                decoding="sync"
                                onError={() => console.log("Verification image failed to load:", VerificationImage)}
                            />
                        </div>

                        <VerificationCodeInput
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            length={codeLength}
                            autoFocus
                            disabled={isLoading}
                        />


                        {formError && (
                            <p className="register-shelter-error">
                                {formError}
                            </p>
                        )}

                        {successMessage && (
                            <p className="register-shelter-success">
                                {successMessage}
                            </p>
                        )}


                        <CustomButton
                            label={isLoading ? "Verifying..." : "Verify your email"}
                            type="submit"
                            fullWidth={false}
                            className="register-shelter-submit"
                            disabled={isLoading || verificationCode.length !== codeLength}
                        />

                        <p className="verify-email-resend-code-text">
                            <span>Didn't receive an email? Check your spam or</span>

                            <button
                                type="button"
                                className="verify-email-resend-button"
                                onClick={handleResendCode}
                                disabled={isResending}
                            >
                                {isResending ? "Sending..." : "Resend the code"}
                            </button>
                        </p>
                    </form>
                </Card>
            </section>

            <section className="register-shelter-right">
                <ImageSlideShow slides={loginSlideshowContent} />
            </section>
        </main>
    );
}
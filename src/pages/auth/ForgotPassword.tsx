import { useState, type SubmitEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";

import "./Login.css";
import "./ForgotPassword.css";

import { completePasswordReset, sendPasswordResetCode } from "../../services/auth/passwordResetService";
import { getPasswordResetError } from "../../utils/error/getPasswordResetError";
import { routes } from "../../constants/routes";

import InfoModal from "../../components/ui/InfoModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import DecorativeLeaf from "../../components/ui/decorative/DecorativeLeaf";
import Spacer from "../../components/layout/Spacer";
import Logo from "../../components/ui/decorative/Logo";
import Card from "../../components/ui/Card";
import ImageSlideshow from "../../components/ui/decorative/ImageSlideShow";
import { loginSlideshowContent } from "../../data/assets/imageContent";
import { signOut } from "aws-amplify/auth";

//Steps used during the password reset process
type PasswordResetStep =
    | "email"
    | "confirmation";

/**
 * Route state used to pre-fill the user's email address.
 */
type ForgotPasswordRouteState = {
    initialEmail?: string;
};

/**
 * Manages the forgot password flow.
 * Handles sending a verification code and creating a new password.
 */
export default function ForgotPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const routeState = location.state as
        | ForgotPasswordRouteState
        | null;

    const [email, setEmail] = useState(
        routeState?.initialEmail
            ?.trim()
            .toLowerCase() ?? ""
    );

    const [step, setStep] = useState<PasswordResetStep>("email");

    const [confirmationCode, setConfirmationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    //Validate the email and request a password reset code
    async function handleSendCode(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const normalisedEmail = email.trim().toLowerCase();

        setFormError("");

        if (!normalisedEmail) {
            setFormError("Please enter your email address.");

            return;
        }

        setIsLoading(true);

        try {
            //send code to user
            const result = await sendPasswordResetCode(normalisedEmail);

            setEmail(normalisedEmail);

            if (result.isComplete) {
                setShowSuccessModal(true);
                return;
            }

            setStep("confirmation");
        } catch (error) {
            console.error(
                "Unable to send password reset code:",
                error
            );

            setFormError(
                getPasswordResetError(error)
            );
        } finally {
            setIsLoading(false);
        }
    }

    //Validate the code and complete the password reset
    async function handleConfirmPassword(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setFormError("");

        if (!confirmationCode.trim()) {
            setFormError("Please enter your verification code.");
            return;
        }

        if (!newPassword) {
            setFormError("Please enter a new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setFormError("The passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            await completePasswordReset({email, confirmationCode, newPassword});

            try {
                await signOut();
            } catch {
                // The user may already be signed out.
            }

            setShowSuccessModal(true);
        } catch (error) {
            setFormError(getPasswordResetError(error));
        } finally {
            setIsLoading(false);
        }
    }

    //Request another password reset verification code
    async function handleResendCode() {
        setFormError("");
        setIsLoading(true);

        try {
            await sendPasswordResetCode(email);

        } catch (error) {
            console.error(
                "Unable to resend password reset code:",
                error
            );

            setFormError(getPasswordResetError(error));
        } finally {
            setIsLoading(false);
        }
    }

    //Close the success modal and return to login
    function handleSuccessContinue() {
        setShowSuccessModal(false);

        navigate(
            routes.auth.login,
            { replace: true }
        );
    }

    return (
        <main className="login-page">
            <section className="login-left">

                <DecorativeLeaf top={18} left={0} rotate={90} width={260} height={260} />
                <DecorativeLeaf bottom={-70} right={80} rotate={-60} flipX width={260} height={260} />

                <Spacer height={50} />

                <Logo hasTagline size="lg" />

                <Card>
                    {step === "email" ? (
                        <>
                            <div className="forgot-password-heading">
                                <h1>Reset your password</h1>
                                <p>
                                    Enter your account email and
                                    we will send you a verification
                                    code.
                                </p>


                            </div>

                            <form
                                onSubmit={handleSendCode}
                                className="forgot-password-form"
                            >
                                <label htmlFor="reset-email">
                                    Email address
                                </label>

                                <input
                                    id="reset-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    autoComplete="email"
                                    placeholder="Enter your email address"
                                    required
                                />

                                {formError && (
                                    <p
                                        className="forgot-password-error"
                                        role="alert"
                                    >
                                        {formError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner size="small"/>
                                        </>
                                    ) : (
                                        "Send code"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="forgot-password-heading">

                                <h1>Create a new password</h1>

                                <p>
                                    We've sent you a code to{" "}
                                    <strong>
                                        {email}
                                    </strong>
                                    . Check your email and spam folder!
                                </p>
                            </div>

                            <form
                                onSubmit={ handleConfirmPassword }
                                className="forgot-password-form"
                            >
                                <label htmlFor="reset-code">
                                    Verification code
                                </label>

                                <input
                                    id="reset-code"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    value={confirmationCode}
                                    onChange={(event) =>
                                        setConfirmationCode(
                                            event.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6)
                                        )
                                    }
                                    placeholder="Enter your code"
                                    maxLength={6}
                                    required
                                />

                                <label htmlFor="new-password">
                                    New password
                                </label>

                                <div className="password-input-wrapper">
                                    <Lock
                                        size={18}
                                    />

                                    <input
                                        id="new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={newPassword}
                                        onChange={(event) => setNewPassword(event.target.value)}
                                        placeholder="Enter a new password"
                                        required
                                    />
                                </div>

                                <label htmlFor="confirm-new-password">
                                    Confirm new password
                                </label>

                                <div className="password-input-wrapper">
                                    <Lock
                                        size={18}
                                    />

                                    <input
                                        id="confirm-new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter the password again"
                                        required
                                    />
                                </div>

                                {formError && (
                                    <p
                                        className="forgot-password-error"
                                        role="alert"
                                    >
                                        {formError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner
                                                size="small"
                                            />
                                        </>
                                    ) : (
                                        "Update password"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="resend-code-button"
                                    onClick={handleResendCode}
                                    disabled={isLoading}
                                >
                                    Resend code
                                </button>
                            </form>
                        </>
                    )}

                </Card>

            </section>
            <section className="login-right">
                <ImageSlideshow
                    slides={loginSlideshowContent}
                />
            </section>

            <InfoModal
                visible={showSuccessModal}
                title="Password updated"
                message="Your password has been changed successfully. Please sign in again using your new password."
                icon={ShieldCheck}
                buttonText="Continue to login"
                onConfirm={handleSuccessContinue}
                onClose={handleSuccessContinue}
            />
        </main>
    );
}

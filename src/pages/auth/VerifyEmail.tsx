import { ArrowLeft } from "lucide-react";

import Logo from "../../components/ui/decorative/Logo";
import Card from "../../components/ui/Card";

import CustomButton from "../../components/ui/CustomButton";
import ImageSlideShow from "../../components/ui/decorative/ImageSlideShow";

import Spacer from "../../components/layout/Spacer";
import { loginSlideshowContent } from "../../data/assets/imageContent";

import "./RegisterShelter.css"; //Basically the same css
import "./VerifyEmail.css";

import AuthProgressStepper from "../../components/ui/auth/AuthProgressStepper";
import VerificationImage from "../../assets/EmailVerification.webp";
import DecorativeLeaf from "../../components/ui/decorative/DecorativeLeaf";
import VerificationCodeInput from "../../components/ui/auth/VerificationCodeInput";
import { useVerifyEmail } from "../../hooks/auth/useVerifyEmail";

export default function VerifyEmail() {
    const {
        email,

        verificationCode,
        setVerificationCode,

        codeLength,

        isLoading,
        isResending,

        formError,
        successMessage,

        handleVerifyEmail,
        handleResendCode,
        goToLogin,
    } = useVerifyEmail();

    return (
        <main className="register-shelter-page">
            <section className="register-shelter-left">
                <DecorativeLeaf top={18} left={0} rotate={90} width={230} height={230} />
                <DecorativeLeaf bottom={-70} right={70} rotate={-60} flipX width={230} height={230} />

                <button
                    type="button"
                    className="account-type-back"
                    onClick={() => { goToLogin }}
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
                                decoding="async"
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
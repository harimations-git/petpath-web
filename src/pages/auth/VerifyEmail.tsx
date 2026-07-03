import { useEffect, useState } from "react";
import { Mail, Lock, BadgeCheck, Building2, ArrowLeft } from "lucide-react";

import Logo from "../../components/ui/Logo";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import CustomButton from "../../components/ui/CustomButton";
import ImageSlideShow from "../../components/ui/ImageSlideShow";


import Spacer from "../../components/layout/Spacer";
import { loginSlideshowContent } from "../../data/imageContent";

import "./RegisterShelter.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

import AuthProgressStepper from "../../components/ui/auth/AuthProgressStepper";
import VerificationImage from "../../assets/EmailVerification.png";
import DecorativeLeaf from "../../components/ui/DecorativeLeaf";

type VerifyEmailState = {
    email?: string;
    accountType?: "shelter";
};

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    const state = (location.state ?? {}) as VerifyEmailState;
    const email = state.email ?? sessionStorage.getItem("pendingVerificationEmail") ?? "";

    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        document.title = "Verify Email | PetPath";
    }, []);

    return (
        <main className="register-shelter-page">
            <section className="register-shelter-left">
                <DecorativeLeaf top={18} left={0} rotate={90} width={230} height={230} />
                <DecorativeLeaf bottom={-70} right={70} rotate={-60} flipX width={230} height={230} />

                <button
                    type="button"
                    className="account-type-back"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
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


                    <form className="register-shelter-form">
                        <img src={VerificationImage}
                        />


                        {formError && (
                            <p className="register-shelter-error">
                                {formError}
                            </p>
                        )}

                       

                        <CustomButton
                            label={isLoading ? "Verifying..." : "Verify your email"}
                            type="submit"
                            fullWidth={false}
                            className="register-shelter-submit"
                        />

                        <p className="register-shelter-login-text">
                            Didn't receive an email? Check your spam or
                            <br />
                            <Link to={routes.auth.login}>resend the code</Link>
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
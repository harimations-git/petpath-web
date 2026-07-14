import { useEffect, useState } from "react";
import { Mail, Lock, BadgeCheck, Building2, ArrowLeft } from "lucide-react";

import Logo from "../../components/ui/Logo";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import CustomButton from "../../components/ui/CustomButton";
import ImageSlideShow from "../../components/ui/ImageSlideShow";
import DecorativeLeaf from "../../components/ui/DecorativeLeaf";

import Spacer from "../../components/layout/Spacer";
import { loginSlideshowContent } from "../../data/imageContent";

import "./RegisterShelter.css";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

import { signUp } from "aws-amplify/auth";
import { getSignUpErrorMessage } from "../../utils/error/authErrorMessage";
import AuthProgressStepper from "../../components/ui/auth/AuthProgressStepper";

export default function RegisterShelter() {
    const navigate = useNavigate();

    const [charityId, setCharityId] = useState("");
    const [charityName, setCharityName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        document.title = "Register Shelter | PetPath";
    }, []);

    async function handleRegisterShelter(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError("");

        const normalisedEmail = email.trim().toLowerCase();

        if (password !== confirmPassword) {
            setFormError("Passwords do not match");
            return;
        }

        if (!acceptedTerms) {
            setFormError("You need to accept the terms before continuing"); //Extra failsafe
            return;
        }

        try {
            setIsLoading(true);

            await signUp({
                username: normalisedEmail,
                password,
                options: {
                    userAttributes: {
                        email: normalisedEmail,
                        name: charityName.trim(),
                        "custom:charity_id": charityId.trim(),
                        "custom:charity_name": charityName.trim(),
                        "custom:account_type": "shelter",
                    },
                    autoSignIn: true,
                },
            });

            sessionStorage.setItem(
                "pendingShelterRegistration",
                JSON.stringify({
                    charityId: charityId.trim(),
                    charityName: charityName.trim(),
                    email: normalisedEmail
                })
            );

            sessionStorage.setItem("pendingVerificationEmail", normalisedEmail);

            navigate(routes.auth.verifyEmail, {
                replace: true,
                state: {
                    email: normalisedEmail,
                    accountType: "shelter",
                },
            });
        } catch (error) {
            setFormError(getSignUpErrorMessage(error));
        } finally {
            setIsLoading(false);
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
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={22} />
                </button>

                <Logo hasTagline size="md" />

                <Spacer height={8} />

                <Card className="register-shelter-card">
                    <AuthProgressStepper
                        currentStep={1}
                        steps={[
                            { label: "Account" },
                            { label: "Verify Email" },
                            { label: "Review" },
                        ]}
                    />
                    <h1 className="register-shelter-title">Register Your Shelter</h1>

                    <p className="register-shelter-description">
                        Use your shelter's official charity details to create an authorised PetPath account.
                    </p>

                    <form className="register-shelter-form" onSubmit={handleRegisterShelter}>
                        <TextInput
                            label="Charity ID"
                            placeholder="Enter your charity ID"
                            type="text"
                            icon={<BadgeCheck size={20} />}
                            value={charityId}
                            onChange={setCharityId}
                            required
                        />

                        <TextInput
                            label="Charity Name"
                            placeholder="Enter your charity name"
                            type="text"
                            icon={<Building2 size={20} />}
                            value={charityName}
                            onChange={setCharityName}
                            required
                        />

                        <TextInput
                            label="Email Address"
                            placeholder="Enter your charity email address"
                            type="email"
                            icon={<Mail size={20} />}
                            value={email}
                            onChange={setEmail}
                            required
                        />

                        <TextInput
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            icon={<Lock size={20} />}
                            value={password}
                            onChange={setPassword}
                            required
                        />

                        <TextInput
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            type="password"
                            icon={<Lock size={20} />}
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            required
                        />

                        {formError && (
                            <p className="register-shelter-error">
                                {formError}
                            </p>
                        )}

                        <label className="register-shelter-checkbox">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(event) => setAcceptedTerms(event.target.checked)}
                                required
                            />

                            <span className="register-shelter-checkbox-box" />

                            <span className="register-shelter-checkbox-text">
                                I agree to PetPath's <Link to={routes.auth.login}>Terms of Service </Link> and <Link to={routes.auth.login}>Privacy Policy</Link>
                            </span>
                        </label>

                        <CustomButton
                            label={isLoading ? "Creating account..." : "Register account"}
                            type="submit"
                            fullWidth={false}
                            className="register-shelter-submit"
                            disabled={!acceptedTerms || isLoading}
                        />

                        <p className="register-shelter-login-text">
                            Already have an account?
                            <br />
                            <Link to={routes.auth.login}>Log in</Link>
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
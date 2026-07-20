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
import { Link } from "react-router-dom";
import { routes } from "../../constants/routes";

import AuthProgressStepper from "../../components/ui/auth/AuthProgressStepper";
import { useRegisterShelter } from "../../hooks/auth/useRegisterShelter";

export default function RegisterShelter() {
    const {
        charityId,
        setCharityId,

        charityName,
        setCharityName,

        email,
        setEmail,

        password,
        setPassword,

        confirmPassword,
        setConfirmPassword,

        acceptedTerms,
        setAcceptedTerms,

        isLoading,
        formError,

        goBack,
        handleRegisterShelter,
    } = useRegisterShelter();

    return (
        <main className="register-shelter-page">
            <section className="register-shelter-left">
                <DecorativeLeaf top={18} left={0} rotate={90} width={230} height={230} />
                <DecorativeLeaf bottom={-70} right={70} rotate={-60} flipX width={230} height={230} />

                <button
                    type="button"
                    className="account-type-back"
                    onClick={() => goBack}
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
                                I agree to PetPath's <Link to={routes.legal.terms}>Terms of Service </Link> and <Link to={routes.legal.privacyPolicy}>Privacy Policy</Link>
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
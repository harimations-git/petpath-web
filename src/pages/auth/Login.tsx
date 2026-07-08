import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signOut, resendSignUpCode } from "aws-amplify/auth";
import { getCurrentOrganisationProfile } from "../../services/organisation/organisationService";
import { getRouteForOrganisation } from "../../services/organisation/organisationRedirect";

import { Mail, Lock } from "lucide-react";
import Logo from "../../components/ui/Logo";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import CustomButton from "../../components/ui/CustomButton";
import ImageSlideShow from "../../components/ui/ImageSlideShow";
import DecorativeLeaf from "../../components/ui/DecorativeLeaf";

import "./Login.css";
import Spacer from "../../components/layout/Spacer";

import { loginSlideshowContent } from "../../data/imageContent";
import { routes } from "../../constants/routes";
import { Link } from "react-router-dom";

export default function ShelterLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    document.title = "Log in | PetPath";;
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError("");
    setIsLoading(true);

    const normalisedEmail = email.trim().toLowerCase();

    try {
      try {
        await signOut();
      } catch {
        // Ignore if nobody was signed in.
      }

      const signInResult = await signIn({
        username: normalisedEmail,
        password,
      });

      const signInStep = signInResult.nextStep.signInStep;

      if (signInStep === "CONFIRM_SIGN_UP") {
        sessionStorage.setItem("pendingVerificationEmail", normalisedEmail);

        try {
          await resendSignUpCode({
            username: normalisedEmail,
          });
        } catch (resendError) {
          console.log("Unable to resend verification code:", resendError);
        }

        navigate(routes.auth.verifyEmail, {
          replace: true,
          state: {
            email: normalisedEmail,
            password,
            accountType: "shelter",
            fromLogin: true,
          },
        });

        return;
      }

      if (!signInResult.isSignedIn || signInStep !== "DONE") {
        setFormError("This account needs another sign-in step before continuing.");
        return;
      }

      const organisationProfile = await getCurrentOrganisationProfile();

      const nextRoute = getRouteForOrganisation(organisationProfile);

      navigate(nextRoute, { replace: true });
    } catch (error) {
      console.log("Login error:", error);

      const authError = error as { name?: string; message?: string };

      if (
        authError.name === "UserNotConfirmedException" ||
        authError.message?.toLowerCase().includes("not confirmed")
      ) {
        sessionStorage.setItem("pendingVerificationEmail", normalisedEmail);

        try {
          await resendSignUpCode({
            username: normalisedEmail,
          });
        } catch (resendError) {
          console.log("Unable to resend verification code:", resendError);
        }

        navigate(routes.auth.verifyEmail, {
          replace: true,
          state: {
            email: normalisedEmail,
            password,
            accountType: "shelter",
            fromLogin: true,
          },
        });

        return;
      }

      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Unable to log in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-left">
        <DecorativeLeaf top={18} left={0} rotate={90} width={260} height={260} />
        <DecorativeLeaf bottom={-70} right={80} rotate={-60} flipX width={260} height={260} />

        <Spacer height={100} />

        <Logo hasTagline size="lg" />

        <Spacer height={10} />

        <Card>
          <h1>Login to manage your shelter</h1>

          <form className="login-form" onSubmit={handleLogin}>
            <TextInput
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              icon={<Mail size={20} />}
              value={email}
              onChange={setEmail}
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              type="password"
              icon={<Lock size={20} />}
              value={password}
              onChange={setPassword}
            />

            <Spacer height={5} />

            <Link className="forgot-link" to={routes.auth.forgotPassword}>
              Forgot password?
            </Link>

            {formError && (
              <p className="register-shelter-error">
                {formError}
              </p>
            )}

            <CustomButton
              label={isLoading ? "Logging in..." : "Log in"}
              type="submit"
              fullWidth={false}
              className="login-btn"
              disabled={isLoading}
            />

            <p className="register-text">
              Don’t have an account?
              <br />
              <Link to={routes.auth.accountType}>Register shelter here</Link>
            </p>
          </form>
        </Card>
      </section>

      <section className="login-right">
        <ImageSlideShow
          slides={loginSlideshowContent}
        />
      </section>
    </main>
  );
}
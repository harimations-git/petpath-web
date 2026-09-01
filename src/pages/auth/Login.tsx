import { Mail, Lock } from "lucide-react";
import Logo from "../../components/ui/decorative/Logo";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/forms/TextInput";
import CustomButton from "../../components/ui/CustomButton";
import ImageSlideShow from "../../components/ui/decorative/ImageSlideShow";
import DecorativeLeaf from "../../components/ui/decorative/DecorativeLeaf";

import "./Login.css";
import Spacer from "../../components/layout/Spacer";

import { loginSlideshowContent } from "../../data/assets/imageContent";
import { routes } from "../../constants/routes";
import { Link } from "react-router-dom";
import { useShelterLogin } from "../../hooks/auth/useShelterLogin";

/**
 * Displays the shelter login page, which can also be used by admins.
 * Uses the login hook to manage authentication and form state.
 * The interface is presented as a shelter login without advertising admin access.
 */
export default function ShelterLogin() {
  const {
        email,
        setEmail,

        password,
        setPassword,

        isLoading,
        formError,

        handleLogin,
    } = useShelterLogin();

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

            <Link
              className="forgot-link"
              to={routes.auth.forgotPassword}
              state={{
                initialEmail: email,
                returnTo: routes.auth.login,
              }}
            >
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
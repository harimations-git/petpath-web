import {
    useEffect,
    useState,
    type SubmitEvent,
} from "react";

import {
    resendSignUpCode,
    signIn,
    signOut,
} from "aws-amplify/auth";

import { routes } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { getCurrentOrganisationProfile } from "../../services/organisation/organisationService";
import { getRouteForOrganisation } from "../../services/organisation/organisationRedirect";


// Describe the parts of an authentication error that this file uses.
type AuthError = {
    name?: string;
    message?: string;
};


// Check whether an unknown error means the account has not been confirmed.
function isUnconfirmedAccountError(error: unknown) {
    const authError = error as AuthError;

    return (
        authError.name === "UserNotConfirmedException" ||
        authError.message?.toLowerCase().includes("not confirmed")
    );
}

export function useShelterLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        document.title = "Log in | PetPath";
    }, []);

    // Send an unconfirmed user to the email verification page.
    async function sendUserToVerification(
        normalisedEmail: string
    ) {
        // Save the email temporarily in the browser.
        sessionStorage.setItem("pendingVerificationEmail", normalisedEmail);

        try {
            //send another code
            await resendSignUpCode({ username: normalisedEmail });
        } catch (resendError) {
            console.log("Unable to resend verification code:", resendError);
        }

        //move the user
        navigate(routes.auth.verifyEmail, {
            replace: true,
            state: {
                email: normalisedEmail,
                password,
                accountType: "shelter",
                fromLogin: true,
            },
        });
    }

    //handles the login submission
    async function handleLogin(
        event: SubmitEvent<HTMLFormElement>
    ) {
        //stop the browser from refreshing the page
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

            //try to sign in with details
            const signInResult =
                await signIn({
                    username: normalisedEmail,
                    password,
                });

            //get the next step cognito says is required
            const signInStep = signInResult.nextStep.signInStep;

            //if the user needs to verify their email redirect them
            if (signInStep === "CONFIRM_SIGN_UP") {
                await sendUserToVerification(normalisedEmail);

                return;
            }

            //check the login is "complete"
            if (
                !signInResult.isSignedIn || signInStep !== "DONE"
            ) {
                setFormError(
                    "This account needs another sign-in step before continuing."
                );

                return;
            }

            //load their profile
            const organisationProfile = await getCurrentOrganisationProfile();

            //decide which page they need to go to
            //i.e. approved account --> dashboard
            //     pending account -> account review page
            const nextRoute = getRouteForOrganisation(organisationProfile);

            navigate(nextRoute, { replace: true });
        } catch (error) {
            console.log("Login error:", error);

            //if cognito rejects, the account has not confirmed the email
            if (isUnconfirmedAccountError(error)) {
                //redirect
                await sendUserToVerification(normalisedEmail);

                return;
            }

            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError(
                    "Unable to log in. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return {
        email,
        setEmail,

        password,
        setPassword,

        isLoading,
        formError,

        handleLogin,
    };
}
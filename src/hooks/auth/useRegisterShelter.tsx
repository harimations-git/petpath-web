import {
    useEffect,
    useState,
    type SubmitEvent,
} from "react";

import {useNavigate} from "react-router-dom";
import {signUp} from "aws-amplify/auth";
import {routes} from "../../constants/routes";
import {getSignUpErrorMessage,} from "../../utils/error/authErrorMessage";

export function useRegisterShelter() {
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

    //move the user back one page
    function goBack() {
        navigate(-1);
    }

    async function handleRegisterShelter(
        event: SubmitEvent<HTMLFormElement>
    ) {
        //prevents the browser from refreshing
        event.preventDefault();

        setFormError("");

        const normalisedEmail = email.trim().toLowerCase();
        const trimmedCharityId = charityId.trim();
        const trimmedCharityName = charityName.trim();

        if (password !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }

        if (!acceptedTerms) {
            setFormError(
                "You need to accept the terms before continuing."
            );
            return;
        }

        try {
            setIsLoading(true);

            //ask cognito to create he new user
            await signUp({
                username: normalisedEmail,
                password,

                options: {
                    userAttributes: {
                        email:
                            normalisedEmail,

                        name:
                            trimmedCharityName,

                        "custom:charity_id": trimmedCharityId,

                        "custom:charity_name": trimmedCharityName,

                        "custom:account_type": "shelter",
                    },
                    autoSignIn: true,
                },
            });

            //temp. store the registration details in this browser tab's session storage
            sessionStorage.setItem(
                "pendingShelterRegistration",
                JSON.stringify({
                    charityId: trimmedCharityId,
                    charityName: trimmedCharityName,

                    email: normalisedEmail,
                })
            );

            //store email separately so the verification page can retrieve it after a refresh if necessary
            sessionStorage.setItem("pendingVerificationEmail", normalisedEmail);

            navigate(routes.auth.verifyEmail, {
                replace: true,
                state: {
                    email: normalisedEmail,
                    password,
                    accountType: "shelter",
                },
            });
        } catch (error) {
            setFormError(
                getSignUpErrorMessage(error)
            );
        } finally {
            setIsLoading(false);
        }
    }

    return {
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
    };
}
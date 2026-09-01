import {useEffect, useState} from "react";
import {fetchAuthSession} from "aws-amplify/auth";

/**
 * Checks whether the user currently has a valid authentication session.
 */
export function useAuthSessionCheck() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);

    //Check the user's authentication session when the hook first runs
    useEffect(() => {
        async function checkSession() {
            try {
                const session = await fetchAuthSession();

                setIsSignedIn(
                    Boolean(session.tokens?.accessToken)
                );
            } catch {
                setIsSignedIn(false);
            } finally {
                setIsCheckingAuth(false);
            }
        }

        void checkSession();
    }, []);

    return {
        isCheckingAuth,
        isSignedIn,
    };
}
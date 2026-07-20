import {useEffect, useState} from "react";
import {fetchAuthSession} from "aws-amplify/auth";

export function useAuthSessionCheck() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);

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
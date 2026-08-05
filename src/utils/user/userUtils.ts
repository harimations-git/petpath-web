import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Helper function used to get the user's id token
 * Used to verify the user is an admin
 * @returns 
 */
export async function getAdminIdToken() {
    const session = await fetchAuthSession();

    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
        throw new Error(
            "You must be signed in as an administrator."
        );
    }

    return idToken;
}
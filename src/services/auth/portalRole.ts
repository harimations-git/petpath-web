import {
    fetchAuthSession,
} from "aws-amplify/auth";

// Determines if the user is an admin or regular user
export type PortalRole =
    | "admin"
    | "organisation"
    | null;

/**
* Read the user's role from their
* Cognito group membership.
*/
export async function getCurrentPortalRole():
    Promise<PortalRole> {
    const session = await fetchAuthSession();

    const groupsClaim = session.tokens?.idToken?.payload["cognito:groups"];

    const groups =
        Array.isArray(groupsClaim)
            ? groupsClaim.filter(
                (group): group is string =>
                    typeof group === "string"
            )
            : [];

    if (groups.includes("Admin")) {
        return "admin";
    }

    if (groups.includes("Organisation")) {
        return "organisation";
    }

    return null;
}
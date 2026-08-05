import type { OrganisationSortOrder, PendingOrganisationsResponse, ReviewOrganisationRequest } from "../../types/admin/adminOrganisation";
import { getErrorMessage } from "../../utils/error/authErrorMessage";
import { getAdminIdToken } from "../../utils/user/userUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * GET request receives all the organisation applications that are pending
 * sorting by eiter oldest or newest.
 * @param sortOrder 
 * @param nextToken 
 * @returns 
 */
export async function getPendingOrganisations(
    sortOrder: OrganisationSortOrder,
    nextToken?: string | null
): Promise<PendingOrganisationsResponse> {

    const idToken = await getAdminIdToken();

    const query = new URLSearchParams({ sortOrder });

    if (nextToken) {
        query.set("nextToken", nextToken);
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/organisations/pending?${query.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(
                response,
                "Unable to load pending organisations."
            )
        );
    }

    return await response.json() as PendingOrganisationsResponse;
}

/**
 * Function used by the PetPath Admin when a decision has been made on
 * an organisation's account, approve or reject with an optional reason
 * @param param0 
 */
export async function reviewOrganisation({
    organisationId,
    decision,
    reason,
}: ReviewOrganisationRequest) {
    const idToken = await getAdminIdToken();

    const response =await fetch(
        `${API_BASE_URL}/admin/organisations/${encodeURIComponent(organisationId)}/review`,
            {
                method: "PATCH",

                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    decision,
                    reason,
                }),
            }
        );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(
                response,
                "Unable to review the organisation."
            )
        );
    }
}
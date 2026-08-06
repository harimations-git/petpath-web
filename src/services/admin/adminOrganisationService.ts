import type { GetListingsQueryParams } from "../../types/admin/adminManagement";
import type { ApprovedOrganisationsResponse, PendingOrganisationsResponse, ReviewOrganisationRequest } from "../../types/admin/adminOrganisation";
import type { SortOrder } from "../../types/filters";
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
    sortOrder: SortOrder,
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
 * GET request that returns all organisations that have been approved
 * @param param0 
 */
export async function getApprovedOrganisations({
    sortOrder,
    nextToken,
}: GetListingsQueryParams): Promise<ApprovedOrganisationsResponse> {

    const idToken = await getAdminIdToken();

    const searchParams = new URLSearchParams({sortOrder});

    if (nextToken) {
        searchParams.set("nextToken", nextToken);
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/organisations/approved?${searchParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to load approved organisations."
        );
    }

    return {
        organisations:
            Array.isArray(data.organisations)
                ? data.organisations
                : [],

        nextToken: data.nextToken ?? null,
    };
}

/**
 * Function used by the PetPath Admin when a decision has been made on
 * an organisation's account, approve or reject with an optional reason
 * @param param0 
 */
export async function reviewOrganisation({
    organisationId,
    decision,
}: ReviewOrganisationRequest) {
    const idToken = await getAdminIdToken();

    const response = await fetch(
        `${API_BASE_URL}/admin/organisations/${encodeURIComponent(organisationId)}/review`,
        {
            method: "PATCH",

            headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                decision,
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
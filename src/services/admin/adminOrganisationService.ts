import type { GetListingsQueryParams } from "../../types/admin/adminManagement";
import type { ApprovedOrganisationsResponse, PendingOrganisationsResponse, PublicOrganisationProfile, ReviewOrganisationRequest } from "../../types/admin/adminOrganisation";
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

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

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

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

    const searchParams = new URLSearchParams({ sortOrder });

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

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

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
            await getErrorMessage(response, "Unable to review the organisation.")
        );
    }
}

export async function getAdminOrganisationDetails(
    organisationId: string
): Promise<PublicOrganisationProfile> {

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

    const response =
        await fetch(
            `${API_BASE_URL}/admin/organisations/${encodeURIComponent(
                organisationId
            )}`,
            {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to load organisation.");
    }

    return data.organisation;
}

/**
 * DELETE route that removes the organisation account 
 * and related database & s3 files 
 * @param organisationId 
 * @returns 
 */
export async function deleteAdminOrganisation(
    organisationId: string
) {
    if (!API_BASE_URL) {
        throw new Error("API base URL is missing.");
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

    const response =
        await fetch(
            `${API_BASE_URL}/admin/organisations/${encodeURIComponent(organisationId)}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to delete organisation account."
        );
    }

    return data;
}
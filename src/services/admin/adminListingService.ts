import type { AdminListingDetails, AdminListingDetailsResponse, ApprovedListing, ApprovedListingsResponse, GetApprovedListingsOptions, PendingListingsResponse, ReviewListingRequest } from "../../types/admin/adminListing";
import type { SortOrder } from "../../types/filters";
import { getErrorMessage } from "../../utils/error/authErrorMessage";
import { getAdminIdToken } from "../../utils/user/userUtils";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Gets one page of pending pet listings.
 */
export async function getPendingListings(
    sortOrder: SortOrder,
    nextToken?: string | null
): Promise<PendingListingsResponse> {

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

    const searchParameters = new URLSearchParams({ sortOrder });

    if (nextToken) {
        searchParameters.set("nextToken", nextToken);
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/listings/pending?${searchParameters.toString()}`,
        {
            method: "GET",

            headers: { Authorization: `Bearer ${idToken}` },
        }
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Unable to load pending listings.")
        );
    }

    const data = await response.json() as Partial<PendingListingsResponse>;

    return {
        listings: data.listings ?? [],
        nextToken: data.nextToken ?? null,
    };
}

/**
 * Request GETs the latest full version of a listing
 * for the admin review page.
 */
export async function getAdminListingDetails(
    listingId: string
): Promise<AdminListingDetails> {

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    if (!listingId.trim()) {
        throw new Error(
            "Listing ID is required."
        );
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/listings/${encodeURIComponent(listingId)}`,
        {
            method: "GET",

            headers: { Authorization: `Bearer ${idToken}` },
        }
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Unable to load the listing.")
        );
    }

    const data = await response.json() as AdminListingDetailsResponse;

    if (!data.listing) {
        throw new Error(
            "The listing information was not returned."
        );
    }

    return data.listing;
}

/**
 * Request sends an admin’s review decision for a pet listing to the API
 * @param param0 
 * @returns 
 */
export async function reviewListing({
    listingId,
    decision,
    reason,
}: ReviewListingRequest) {

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/listings/${encodeURIComponent(listingId)}/review`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                decision,

                //checks if decision was rejected and adds the reason
                ...(decision === "rejected" &&
                    reason?.trim() ? { reason: reason.trim() } : {}),
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Unable to review the listing.")
        );
    }

    return response.json();
}

/**
 * DELETE request that removes a pet listing permanently
 * @param listingId 
 * @returns 
 */
export async function deleteAdminListing(
    listingId: string
) {

    if (!API_BASE_URL) {
        throw new Error("API URL is not configured");
    }

    const idToken = await getAdminIdToken();

    if (!idToken) {
        throw new Error("You must be logged in.");
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/listings/${encodeURIComponent(listingId)}`,
        {
            method: "DELETE",

            headers: { Authorization: `Bearer ${idToken}` },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to delete the listing.");
    }

    return data;
}

/**
 * GET request for the Admin page. Request gets all pet listings that are approved,
 * And have any availability status
 * @param param0 
 * @returns 
 */
export async function getApprovedListings({
    sortOrder,
    nextToken,
}: GetApprovedListingsOptions): Promise<ApprovedListingsResponse> {

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
        `${API_BASE_URL}/admin/listings/approved?${searchParams.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load approved listings."
        );
    }

    return {
        listings: Array.isArray(data.listings) ? data.listings as ApprovedListing[] : [],

        nextToken: data.nextToken ?? null,
    };
}
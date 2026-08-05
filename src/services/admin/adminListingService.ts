import type { PendingListingsResponse } from "../../types/admin/adminListing";
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

    const idToken = await getAdminIdToken();

    const searchParameters = new URLSearchParams({ sortOrder, limit: "10" });

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
import { fetchAuthSession } from "aws-amplify/auth";
import type { AdminDashboardData } from "../../types/admin/adminDashboard";
import type { ErrorResponse } from "../../utils/error/authErrorMessage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//Dashboard data will remain cahced for 60 seconds
const ADMIN_DASHBOARD_CACHE_TTL_MS = 60 * 1000;

/*
 * Represents dashboard data stored
 * in the in-memory cache.
 */
type CachedAdminDashboard = {
    cachedAt: number;
    data: AdminDashboardData;
};


// Stores the most recently loaded dashboard data.
// This cache only exists while the web application
// is open and is cleared when the page reloads.
let memoryCache:
    | CachedAdminDashboard
    | null = null;

// Stores a dashboard request that is currently running.
let pendingRequest:
    | Promise<AdminDashboardData>
    | null = null;

/*
* Clears the cached dashboard data and
* any reference to an existing request.
*/
export function clearAdminDashboardCache() {
    memoryCache = null;
    pendingRequest = null;
}

/*
 * Returns the admin dashboard data.
 *
 */
export async function getAdminDashboard(
    forceRefresh = false
): Promise<AdminDashboardData> {

    if (!forceRefresh && memoryCache) {
        // Calculates how long ago the dashboard data was cached.
        const cacheAge = Date.now() - memoryCache.cachedAt;

        // Returns the cached data if it is less that 60 seconds old
        if (cacheAge < ADMIN_DASHBOARD_CACHE_TTL_MS) {
            return memoryCache.data;
        }
    }

    // If the same request is already running, return its Promise instead of creating
    // another API request.
    if (!forceRefresh && pendingRequest) {
        return pendingRequest;
    }

    const request = fetchAdminDashboard();

    // Stores the request so other calls can reuse it
    pendingRequest = request;

    try {
        const data = await request;
        // Stores the successful response in memory with current time
        memoryCache = { cachedAt: Date.now(), data };

        return data;
    } finally {
        pendingRequest = null;
    }
}

/**
 * Fetches the dashboard statistics to show pending shelters and pet listings
 * @returns 
 */
async function fetchAdminDashboard():
    Promise<AdminDashboardData> {
    const session = await fetchAuthSession();

    const idToken =
        session.tokens
            ?.idToken
            ?.toString();

    if (!idToken) {
        throw new Error(
            "You must be logged in as an administrator."
        );
    }

    const response =
        await fetch(
            `${API_BASE_URL}/admin/dashboard`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );

    const responseText = await response.text();

    const data = responseText ? JSON.parse(responseText) : {};

    if (!response.ok) {
        const errorResponse = data as ErrorResponse;

        throw new Error(errorResponse.message || "Unable to load the admin dashboard.");
    }

    return data as AdminDashboardData;
}
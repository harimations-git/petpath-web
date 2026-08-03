import { fetchAuthSession } from "aws-amplify/auth";
import type { AdminDashboardData } from "../../types/adminDashboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ADMIN_DASHBOARD_CACHE_TTL_MS = 60 * 1000;

type CachedAdminDashboard = {
    cachedAt: number;
    data: AdminDashboardData;
};

type ErrorResponse = {
    message?: string;
};

let memoryCache:
    | CachedAdminDashboard
    | null = null;

let pendingRequest:
    | Promise<AdminDashboardData>
    | null = null;

export function clearAdminDashboardCache() {
    memoryCache = null;
    pendingRequest = null;
}

export async function getAdminDashboard(
    forceRefresh = false
): Promise<AdminDashboardData> {

    if (!forceRefresh && memoryCache) {
        const cacheAge = Date.now() - memoryCache.cachedAt;

        if (cacheAge < ADMIN_DASHBOARD_CACHE_TTL_MS) {
            return memoryCache.data;
        }
    }

    if (!forceRefresh && pendingRequest) {
        return pendingRequest;
    }

    const request = fetchAdminDashboard();

    pendingRequest = request;

    try {
        const data = await request;

        memoryCache = {
            cachedAt: Date.now(),
            data,
        };

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

    const data = responseText?JSON.parse(responseText): {};

    if (!response.ok) {
        const errorResponse = data as ErrorResponse;

        throw new Error(errorResponse.message || "Unable to load the admin dashboard.");
    }

    return data as AdminDashboardData;
}
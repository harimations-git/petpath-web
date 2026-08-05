import type { PendingListing } from "./adminListing";
import type { PendingOrganisation } from "./adminOrganisation";

/*
 * Contains the main statistics displayed
 * on the admin dashboard.
 */
export type AdminDashboardStatistics = {
    pendingOrganisationCount: number;
    pendingListingCount: number;
    oldestWaitingAt: string | null;
};

/*
 * Represents all data returned for
 * the admin dashboard.
 */
export type AdminDashboardData = {
    periodDays: number;
    periodStart: string;

    statistics: AdminDashboardStatistics;

    pendingOrganisations: PendingOrganisation[];

    pendingListings: PendingListing[];
};
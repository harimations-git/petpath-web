import type { PendingOrganisation } from "./adminOrganisation";

/*
 * Represents a pet listing that is
 * waiting for admin review.
 */
export type PendingListing = {
    listingId: string;
    title: string;
    organisationId: string;
    organisationName: string;
    animalType: string;
    listingType: string;
    documentCount: number;
    submittedAt: string;
};

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
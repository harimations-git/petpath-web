export type PendingOrganisation = {
    organisationId: string;
    charityName: string;
    charityId: string;
    email: string;
    submittedAt: string;
};

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

export type AdminDashboardStatistics = {
    pendingOrganisationCount: number;
    pendingListingCount: number;
    oldestWaitingAt: string | null;
};

export type AdminDashboardData = {
    periodDays: number;
    periodStart: string;

    statistics: AdminDashboardStatistics;

    pendingOrganisations: PendingOrganisation[];

    pendingListings: PendingListing[];
};
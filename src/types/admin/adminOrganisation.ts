import type { AdminReviewDecision } from "./adminManagement";

//A pending organisation requires the following to display on the frontend
export type PendingOrganisation = {
    organisationId: string;
    charityName: string;
    charityId: string;
    email: string;
    submittedAt: string;
};

//Summary information for pending organisations, total number and submission date of the olded application
export type PendingOrganisationStatistics = {
    pendingCount: number;
    oldestSubmittedAt: string | null;
};

//Complete response returned by the backend lambda
export type PendingOrganisationsResponse = {
    organisations: PendingOrganisation[];
    nextToken: string | null; //pagination token
};

export type ApprovedOrganisation = {
    organisationId: string;

    charityName: string;
    charityId: string;
    email: string;

    reviewStatus: "approved";

    submittedAt: string;
    reviewedAt?: string;
    updatedAt?: string;
};

export type ApprovedOrganisationsResponse = {
    organisations: ApprovedOrganisation[];
    nextToken?: string | null;
};

//Decision made by the admin, containing the account that was decided and
//the decision that was made.
export type ReviewOrganisationRequest = {
    organisationId: string;
    decision: AdminReviewDecision;
};

/**
 * Type used to display the organisation's public information to the admin user
 */
export type PublicOrganisationProfile = {
    organisationId: string;

    charityName: string;
    charityId?: string;
    email: string;

    description?: string;
    websiteUrl?: string;

    profileImageUrl?: string | null;

    addressLineOne?: string;
    addressLineTwo?: string;
    townCity?: string;
    postcode?: string;
    locationCounty?: string;
    locationCountry?: string;

    createdAt: string;
    reviewedAt?: string;
    updatedAt?: string;
};
import type { SortOrder } from "../filters";

//Options the admin has when reviewing a organisation account
export type OrganisationReviewDecision =
    | "approved"
    | "rejected";

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

//Get request type for the response sent to the backend lambda
export type GetPendingOrganisationsOptions = {
    sortOrder: SortOrder;
    nextToken?: string | null;
};

//Decision made by the admin, containing the account that was decided and
//the decision that was made.
export type ReviewOrganisationRequest = {
    organisationId: string;
    decision: OrganisationReviewDecision;
};
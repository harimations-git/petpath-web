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

export type PendingListingsResponse = {
    listings: PendingListing[];
    nextToken: string | null;
};
import type { SortOrder } from "../filters";
import type { MatchingProfileForm } from "../matchingProfile";
import type { AdminReviewDecision } from "./adminManagement";

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
    submittedAt: string;
};

/*
 * Represents an approved pet listing that is
 * either available, reserved or rehomed
 */
export type ApprovedListing = {
    listingId: string;

    title: string;

    organisationId: string;
    organisationName: string;

    animalType: string;
    listingType: string;

    reviewStatus: "approved";

    availabilityStatus:
        | "available"
        | "reserved"
        | "rehomed";

    reviewedAt?: string;
    updatedAt?: string;
};

export type ApprovedListingsResponse = {
    listings: ApprovedListing[];
    nextToken?: string | null;
};

export type PendingListingsResponse = {
    listings: PendingListing[];
    nextToken: string | null;
};

export type AdminListingAnimal = {
    animalId: string;
    animalOrder: number;

    name?: string;
    ageText?: string;
    sex?: string;
    breedSpecies?: string;
    temperament?: string;
};

export type AdminListingDocument = {
    name: string;
    url: string;
};

export type AdminListingDetails = {
    listingId: string;

    title: string;
    organisationId: string;
    organisationName: string;

    reviewStatus: string;
    availabilityStatus?: string;

    animalType: string;
    listingType: string;
    numberOfAnimals: number;

    description: string;
    enquiryUrl?: string;

    adoptionFee?: number | string | null;

    locationTown?: string;
    locationCounty?: string;
    locationCountry?: string;
    locationPostcode?: string;

    photos: string[];
    animals: AdminListingAnimal[];

    matchingProfile?: MatchingProfileForm;

    vaccinationStatus?: string;
    microchipStatus?: string;
    neuteredStatus?: string;
    healthNotes?: string;

    veterinaryDocuments: AdminListingDocument[];

    createdAt: string;
    updatedAt?: string;
};

export type AdminListingDetailsResponse = {
    listing: AdminListingDetails;
};

//Expected format for the view listing matching profile field order
export const MATCHING_PROFILE_FIELD_ORDER = [
    "petCost",
    "spaceNeeded",
    "experienceNeeded",
    "activityNeeded",
    "attentionNeeded",
    "homeType",
] as const;

export type ReviewListingRequest = {
    listingId: string;
    decision: AdminReviewDecision;
    reason?: string;
};

export type GetApprovedListingsOptions = {
    sortOrder: SortOrder
    nextToken?: string | null;
};
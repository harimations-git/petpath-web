import type { MatchingProfileForm } from "./matchingProfile";

export type ListingType =
    | "individual"
    | "group";

export type ListingReviewStatus =
    | "pending"
    | "approved"
    | "rejected";

export type ListingAvailabilityStatus =
    | "available"
    | "reserved"
    | "rehomed";

/**
 * Used on the main PetListing
 * "Mixed" is included because group listings can contain different types of animals.
 */
export type ListingAnimalCategory =
    | "dog"
    | "cat"
    | "rabbit"
    | "guinea_pig"
    | "mixed"
    | "other";

/**
 * Used for each individual animal.
 */
export type AnimalType =
    | "dog"
    | "cat"
    | "rabbit"
    | "guinea_pig"
    | "other";

export type AnimalSex =
    | "male"
    | "female";

export type ListingAnimalForm = {
    id: string;
    name: string;
    animalType: AnimalType | "";
    breedSpecies: string;
    sex: AnimalSex | "";
    ageText: string;
    temperament: string;
};

export type CreateListingInput = {
    title: string;
    listingType: ListingType;
    animalType: ListingAnimalCategory;
    numberOfAnimals: number;
    description: string;
    listingUrl: string;
    adoptionFee: number;

    vaccinationStatus: string;
    microchipStatus: string;
    neuteredStatus: string;
    healthNotes: string;

    matchingProfile: MatchingProfileForm;

    animals: ListingAnimalForm[];
};

export type UploadedListingPhoto = {
    key: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    photoOrder: number;
};

export type UploadedVeterinaryDocument = {
    key: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
};

export type CreateListingAnimalInput = {
    animalId: string;
    name: string;
    animalType: AnimalType;
    breedSpecies: string;
    sex: AnimalSex;
    ageText: string;
    temperament: string;
    animalOrder: number;
};

export type CreatePetListingRequest = {
    listingId: string;

    title: string;
    listingType: ListingType;
    animalType: ListingAnimalCategory;
    numberOfAnimals: number;
    description: string;

    enquiryUrl: string;
    adoptionFee: number;

    vaccinationStatus: string;
    microchipStatus: string;
    neuteredStatus: string;
    healthNotes: string;

    photos: UploadedListingPhoto[];

    veterinaryDocuments:
    UploadedVeterinaryDocument[];

    matchingProfile: MatchingProfileForm;

    animals: CreateListingAnimalInput[];
};

export type PetListingSummary = {
    listingId: string;
    organisationId: string;

    title: string;
    listingType: ListingType;
    animalType: ListingAnimalCategory;
    numberOfAnimals: number;

    description: string;
    enquiryUrl: string;
    adoptionFee: number;

    locationTown: string;
    locationCounty?: string;
    locationPostcode: string;
    locationCountry: string;

    vaccinationStatus: string;
    microchipStatus: string;
    neuteredStatus: string;
    healthNotes?: string;

    photos: UploadedListingPhoto[];

    reviewStatus: ListingReviewStatus;

    availabilityStatus:
        ListingAvailabilityStatus;

    createdAt: string;
    updatedAt: string;

    primaryPhotoUrl?: string;
};

export type GetOrganisationListingsResponse = {
    listings: PetListingSummary[];
    nextToken: string | null;
};
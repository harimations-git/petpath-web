import type { MatchingProfileForm } from "./matchingProfile";
import type { MicrochipStatus, NeuteredStatus, VaccinationStatus } from "./vetInformation";

// Types used for the main pet listing status and category fields

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
 * Animal category used on the main pet listing.
 * "Mixed" is included because group listings can contain different types of animals.
 */
export type ListingAnimalCategory =
    | "dog"
    | "cat"
    | "rabbit"
    | "guinea_pig"
    | "mixed"
    | "other";

// Types used for individual animals within a listing

export type AnimalType =
    | "dog"
    | "cat"
    | "rabbit"
    | "guinea_pig"
    | "other";

export type AnimalSex =
    | "male"
    | "female";


/**
 * Stores the form values for an individual animal.
 */
export type ListingAnimalForm = {
    id: string;
    name: string;
    animalType: AnimalType | "";
    breedSpecies: string;
    sex: AnimalSex | "";
    ageText: string;
    temperament: string;
};

/**
 * Values collected when creating a new pet listing.
 */
export type CreateListingInput = {
    title: string;
    listingType: ListingType;
    animalType: ListingAnimalCategory;
    numberOfAnimals: number;
    description: string;
    listingUrl: string;
    adoptionFee: number;

    vaccinationStatus: VaccinationStatus;
    microchipStatus: MicrochipStatus;
    neuteredStatus: NeuteredStatus;
    healthNotes: string;

    matchingProfile: MatchingProfileForm;

    animals: ListingAnimalForm[];
};


/**
 * Stores information about a photo uploaded for a listing.
 */
export type UploadedListingPhoto = {
    key: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    photoOrder: number;
};

/**
 * Stores information about an uploaded veterinary document.
 */
export type UploadedVeterinaryDocument = {
    key: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
};

/**
 * Represents an individual animal sent to the backend when creating a listing.
 */
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

/**
 * Request sent to the backend when creating a new pet listing.
 */
export type CreatePetListingRequest = {
    listingId: string;

    title: string;
    listingType: ListingType;
    animalType: ListingAnimalCategory;
    numberOfAnimals: number;
    description: string;

    enquiryUrl: string;
    adoptionFee: number;

    vaccinationStatus: VaccinationStatus;
    microchipStatus: MicrochipStatus;
    neuteredStatus: NeuteredStatus;
    healthNotes: string;

    photos: UploadedListingPhoto[];

    veterinaryDocuments:
    UploadedVeterinaryDocument[];

    matchingProfile: MatchingProfileForm;

    animals: CreateListingAnimalInput[];
};

/**
 * Stores the main information needed when displaying a listing in a list.
 */
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

    vaccinationStatus: VaccinationStatus;
    microchipStatus: MicrochipStatus;
    neuteredStatus: NeuteredStatus;
    healthNotes?: string;

    photos: UploadedListingPhoto[];

    reviewStatus: ListingReviewStatus;
    reviewReason?: string;
    reviewedAt?: string;
    submittedAt?: string;

    availabilityStatus:
    ListingAvailabilityStatus;

    createdAt: string;
    updatedAt: string;

    primaryPhotoUrl?: string;
};

/**
 * Response returned when loading an organisation's listings.
 */
export type GetOrganisationListingsResponse = {
    listings: PetListingSummary[];
    nextToken: string | null;
};

/**
 * Stores the full details of an organisation's pet listing.
 */
export type OrganisationListingDetails = {
    listingId: string;

    title: string;
    listingType: ListingType;
    animalType: ListingAnimalCategory;
    numberOfAnimals: number;

    description: string;
    enquiryUrl: string;
    adoptionFee: number;

    vaccinationStatus: VaccinationStatus;
    microchipStatus: MicrochipStatus;
    neuteredStatus: NeuteredStatus;
    healthNotes: string;

    matchingProfile: MatchingProfileForm;

    animals: ListingAnimalForm[];

    photos: ExistingListingPhoto[];
    documents: ExistingListingDocument[];

    reviewStatus: ListingReviewStatus;
    availabilityStatus: ListingAvailabilityStatus;

    createdAt: string;
    updatedAt: string;
};

/**
 * Values used when updating an existing organisation listing.
 * Includes the listing form values and changes to uploaded files.
 */
export type UpdateOrganisationListingInput =
    CreateListingInput & {
        listingId: string;

        existingPhotoKeys: string[];
        removedPhotoKeys: string[];
        newPhotos: File[];

        existingDocumentKeys: string[];
        removedDocumentKeys: string[];
        newDocuments: File[];
    };

/**
* Represents an existing photo attached to a listing.
*/
export type ExistingListingPhoto = {
    key: string;
    url: string;
};

/**
 * Represents an existing veterinary document attached to a listing.
 */
export type ExistingListingDocument = {
    key: string;
    fileName: string;
    url?: string;
};


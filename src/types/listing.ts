import type { MatchingProfileForm } from "./matchingProfile";

export type ListingType =
    | "individual"
    | "group";

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
    locationTown: string;
    listingUrl: string;

    vaccinationStatus: string;
    microchipStatus: string;
    neuteredStatus: string;
    healthNotes: string;

    matchingProfile: MatchingProfileForm;
    
    animals: ListingAnimalForm[];
};
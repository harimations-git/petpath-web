import type {
    ListingAnimalForm,
} from "../../types/listing";

/**
 * Creates and returns an empty animal form object
 * @returns 
 */
export function createEmptyAnimal():
    ListingAnimalForm {
    return {
        id: crypto.randomUUID(), //generates a unique ID 
        name: "",
        animalType: "",
        breedSpecies: "",
        sex: "",
        ageText: "",
        temperament: "",
    };
}


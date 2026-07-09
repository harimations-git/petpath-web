import type {
    AnimalSex,
    AnimalType,
    ListingAnimalCategory,
} from "../types/listing";

export type SelectOption<T extends string> = {
    label: string;
    value: T;
};

/**
 * Options for the main listing.
 */
export const listingAnimalTypeOptions: SelectOption<ListingAnimalCategory>[] = [
    {
        label: "Dog",
        value: "dog",
    },
    {
        label: "Cat",
        value: "cat",
    },
    {
        label: "Rabbit",
        value: "rabbit",
    },
    {
        label: "Guinea pig",
        value: "guinea_pig",
    },
    {
        label: "Mixed",
        value: "mixed",
    },
    {
        label: "Other",
        value: "other",
    },
];

/**
 * Options for each individual animal
 */
export const individualAnimalTypeOptions: SelectOption<AnimalType>[] = [
    {
        label: "Dog",
        value: "dog",
    },
    {
        label: "Cat",
        value: "cat",
    },
    {
        label: "Rabbit",
        value: "rabbit",
    },
    {
        label: "Guinea pig",
        value: "guinea_pig",
    },
    {
        label: "Other",
        value: "other",
    },
];

export const animalSexOptions: SelectOption<AnimalSex>[] = [
    {
        label: "Male",
        value: "male"
    },
    {
        label: "Female",
        value: "female"
    }
]
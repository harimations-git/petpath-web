import type { AnimalSex, AnimalType, ListingAnimalCategory } from "../../types/listing";
import type { MicrochipStatus, NeuteredStatus, VaccinationStatus } from "../../types/vetInformation";

//type used for dropdown or select options
export type SelectOption<T extends string = string> = {
    label: string;
    value: T;
};

// Animal type options used for the main listing
export const listingAnimalTypeOptions:
    SelectOption<ListingAnimalCategory>[] = [
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

// Animal type options used for individual animals within a listing
export const individualAnimalTypeOptions:
    SelectOption<AnimalType>[] = [
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

//Sex options used for individual animals
export const animalSexOptions:
    SelectOption<AnimalSex>[] = [
        {
            label: "Male",
            value: "male",
        },
        {
            label: "Female",
            value: "female",
        },
    ];

//Vaccination status options used in the listing form
export const vaccinationStatusOptions:
    SelectOption<Exclude<VaccinationStatus, "">>[] = [
        {
            label: "Up to date",
            value: "up_to_date",
        },
        {
            label: "Partially vaccinated",
            value: "partially_vaccinated",
        },
        {
            label: "Not vaccinated",
            value: "not_vaccinated",
        },
        {
            label: "Not applicable",
            value: "not_applicable",
        },
    ];

//Microchip status options used in the listing form
export const microchipStatusOptions:
    SelectOption<Exclude<MicrochipStatus, "">>[] = [
        {
            label: "Microchipped",
            value: "microchipped",
        },
        {
            label: "Not microchipped",
            value: "not_microchipped",
        },
        {
            label: "Not applicable",
            value: "not_applicable",
        },
    ];

//Neutering status options used in the listing form
export const neuteredStatusOptions:
    SelectOption<Exclude<NeuteredStatus, "">>[] = [
        {
            label: "Neutered or spayed",
            value: "neutered",
        },
        {
            label: "Not neutered or spayed",
            value: "not_neutered",
        },
        {
            label: "Not applicable",
            value: "not_applicable",
        },
    ];
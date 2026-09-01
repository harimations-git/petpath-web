// Types used for veterinary health information
export type VaccinationStatus =
    | ""
    | "up_to_date"
    | "partially_vaccinated"
    | "not_vaccinated"
    | "neutered"
    | "not_applicable";

export type MicrochipStatus =
    | ""
    | "microchipped"
    | "not_microchipped"
    | "not_applicable";

export type NeuteredStatus =
    | ""
    | "neutered"
    | "not_neutered"
    | "not_applicable";
import type {
    ActivityNeeded,
    AttentionNeeded,
    ExperienceNeeded,
    MatchingHomeType,
    PetCost,
    SpaceNeeded,
} from "../../types/matchingProfile";

/**
 * Reusable type for matching profile dropdown options.
 */
export type SelectOption<T extends string = string> = {
    label: string;
    value: T; //generic type placeholder
};

/**
 *Exclude removes the empty string from the PetCost type
 *Example: type PetCost = "" | "low" | "medium" | "high";
 *Becomes: "low" | "medium" | "high"
 */
export const petCostOptions: SelectOption<Exclude<PetCost, "">>[] = [
    {
        label: "Low — under £30",
        value: "low",
    },
    {
        label: "Medium — £30 to £60",
        value: "medium",
    },
    {
        label: "High — over £60",
        value: "high",
    },
];

//Outdoor space options used in the matching profile
export const spaceNeededOptions: SelectOption<Exclude<SpaceNeeded, "">>[] = [
    {
        label: "Private garden",
        value: "private_garden",
    },
    {
        label: "Shared garden",
        value: "shared_garden",
    },
    {
        label: "No outdoor space required",
        value: "none",
    },
];

//Activity level options used in the matching profile
export const experienceNeededOptions: SelectOption<Exclude<ExperienceNeeded, "">>[] = [
    {
        label: "Suitable for first-time owners",
        value: "first_time",
    },
    {
        label: "Some experience required",
        value: "some_experience",
    },
    {
        label: "Experienced owners required",
        value: "experienced",
    },
];

//Activity level options used in the matching profile
export const activityNeededOptions: SelectOption<Exclude<ActivityNeeded, "">>[] = [
    {
        label: "Low",
        value: "low",
    },
    {
        label: "Moderate",
        value: "moderate",
    },
    {
        label: "High",
        value: "high",
    },
];

// Attention level options used in the matching profile
export const attentionNeededOptions: SelectOption<Exclude<AttentionNeeded, "">>[] = [
    {
        label: "Low",
        value: "low",
    },
    {
        label: "Moderate",
        value: "moderate",
    },
    {
        label: "High",
        value: "high",
    },
];

//Home type options used in the matching profile
export const matchingHomeTypeOptions: SelectOption<Exclude<MatchingHomeType, "">>[] = [
    {
        label: "Flat",
        value: "flat",
    },
    {
        label: "House",
        value: "house",
    },
    {
        label: "Any home type",
        value: "any",
    },
];
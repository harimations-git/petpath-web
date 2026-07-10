//Types for the dropdown options when creating a pet listing

export type PetCost =
    | ""
    | "low"
    | "medium"
    | "high";

export type SpaceNeeded =
    | ""
    | "private_garden"
    | "shared_garden"
    | "none";

export type ExperienceNeeded =
    | ""
    | "first_time"
    | "some_experience"
    | "experienced";

export type ActivityNeeded =
    | ""
    | "low"
    | "moderate"
    | "high";

export type AttentionNeeded =
    | ""
    | "low"
    | "moderate"
    | "high";

export type MatchingHomeType =
    | ""
    | "flat"
    | "house"
    | "any";

/**
 * Complete matching profile form
 */
export type MatchingProfileForm = {
    petCost: PetCost;
    spaceNeeded: SpaceNeeded;
    experienceNeeded: ExperienceNeeded;
    activityNeeded: ActivityNeeded;
    attentionNeeded: AttentionNeeded;
    homeType: MatchingHomeType;
};
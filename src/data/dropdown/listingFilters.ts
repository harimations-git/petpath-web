import type { FilterOption } from "../../components/ui/filters/FilterDropdown";

//Species options used to filter pet listings
export const speciesFilterOptions: FilterOption[] = [
    {
        label: "All Species",
        value: "all",
    },
    {
        label: "Dogs",
        value: "dog",
    },
    {
        label: "Cats",
        value: "cat",
    },
    {
        label: "Rabbits",
        value: "rabbit",
    },
    {
        label: "Guinea Pigs",
        value: "guinea_pig"
    },
    {
        label: "Other",
        value: "other",
    },
    {
        label: "Mixed",
        value: "mixed"
    }
];

//Listing type options used to filter pet listings
export const listingTypeFilterOptions: FilterOption[] = [
    {
        label: "All listings",
        value: "all",
    },
    {
        label: "Individual",
        value: "individual",
    },
    {
        label: "Group",
        value: "group",
    }
];

//Availability status options used to filter pet listings
export const statusFilterOptions: FilterOption[] = [
    {
        label: "All Statuses",
        value: "all",
    },
    {
        label: "Available",
        value: "available",
    },
    {
        label: "Reserved",
        value: "reserved",
    },
    {
        label: "Rehomed",
        value: "rehomed",
    },
];

//Options used to control how pet listings are sorted
export const sortFilterOptions: FilterOption[] = [
    {
        label: "Newest First",
        value: "newest",
    },
    {
        label: "Oldest First",
        value: "oldest",
    },
    {
        label: "Name A–Z",
        value: "name-asc",
    },
    {
        label: "Name Z–A",
        value: "name-desc",
    },
];

//Review status options used to filter listing review updates
export const reviewStatusFilterOptions = [
    {
        label: "All updates",
        value: "all",
    },
    {
        label: "Pending review",
        value: "pending",
    },
    {
        label: "Rejected",
        value: "rejected",
    },
    {
        label: "Approved",
        value: "approved",
    },
];
import type {
    FilterOption,
} from "../components/ui//filters/FilterDropdown";

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
        label: "Other",
        value: "other",
    },
];

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
        label: "Pending Review",
        value: "pending",
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
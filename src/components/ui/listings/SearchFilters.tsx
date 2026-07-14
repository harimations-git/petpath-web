import {
    Bell,
    ListFilter,
    PawPrint,
    Plus,
} from "lucide-react";

import SearchBar from "../filters/SearchBar";
import FilterDropdown from "../filters/FilterDropdown";
import NavigationButton from "../navigation/NavigationButton";

import {
    sortFilterOptions,
    speciesFilterOptions,
    statusFilterOptions,
} from "../../../data/listingFilters";

import { routes } from "../../../constants/routes";

type MyListingsFiltersProps = {
    searchQuery: string;
    onSearchChange: (value: string) => void;

    speciesFilter: string;
    onSpeciesChange: (value: string) => void;

    statusFilter: string;
    onStatusChange: (value: string) => void;

    sortOrder: string;
    onSortChange: (value: string) => void;
};

export default function MyListingsFilters({
    searchQuery,
    onSearchChange,
    speciesFilter,
    onSpeciesChange,
    statusFilter,
    onStatusChange,
    sortOrder,
    onSortChange,
}: MyListingsFiltersProps) {
    return (
        <div className="my-listings-filters">
            <div className="filters-row">
                <SearchBar
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search by listing title or ID..."
                />

                <div className="filters">
                    <FilterDropdown
                        value={speciesFilter}
                        options={
                            speciesFilterOptions
                        }
                        onChange={
                            onSpeciesChange
                        }
                        icon={<PawPrint />}
                    />

                    <FilterDropdown
                        value={statusFilter}
                        options={
                            statusFilterOptions
                        }
                        onChange={
                            onStatusChange
                        }
                        icon={<Bell />}
                    />

                    <FilterDropdown
                        value={sortOrder}
                        options={
                            sortFilterOptions
                        }
                        onChange={
                            onSortChange
                        }
                        icon={<ListFilter />}
                    />
                </div>

                <NavigationButton
                    label="Create Listing"
                    to={
                        routes.home.createListing
                    }
                    icon={<Plus />}
                />
            </div>
        </div>
    );
}
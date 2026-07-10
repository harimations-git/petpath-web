import { useEffect, useState } from "react";

import { useOrganisationProfile } from "../../context/OrganisationProfileContext";
import { routes } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

import { Bell, ListFilter, PawPrint, Plus } from "lucide-react";

import SearchBar from "../../components/ui/filters/SearchBar";
import FilterDropdown from "../../components/ui/filters/FilterDropdown";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import OrganisationAccountMenu from "../../components/ui/profile/OrganisationAccountMenu";

import {
    sortFilterOptions,
    speciesFilterOptions,
    statusFilterOptions,
} from "../../data/listingFilters";

import "./MyListings.css";
import NavigationButton from "../../components/ui/navigation/NavigationButton";




export default function MyListings() {

    const navigate = useNavigate();
    const { organisationProfile, isLoadingProfile, profileError } = useOrganisationProfile();

    const [searchQuery, setSearchQuery] = useState("");
    const [speciesFilter, setSpeciesFilter] =
        useState("all");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [sortOrder, setSortOrder] =
        useState("newest");

    useEffect(() => {
        document.title = "Shelter Dashboard | PetPath";

        if (!organisationProfile) {
            return;
        }

        if (organisationProfile.accountStatus === "pending") {
            navigate(routes.auth.accountReview, {
                replace: true,
            });

            return;
        }

        if (
            organisationProfile.accountStatus !== "approved"
        ) {
            navigate(routes.auth.login, {
                replace: true,
            });
        }
    }, [organisationProfile, navigate]);

    if (isLoadingProfile) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading your shelter account..."
            />
        );
    }


    if (profileError) {
        return (
            <main className="dashboard-page">
                <p className="dashboard-error">
                    {profileError}
                </p>
            </main>
        );
    }

    return (
        <main className="my-listings-page">
            <header className="my-listings-header">
                <div className="my-listings-heading">
                    <h1>My Listings</h1>

                    <p>
                        Manage, edit and review your current pet listings.
                    </p>
                </div>

                <div className="my-listings-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <div className="my-listings-filters">
                <div className="filters-row">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by pet name, breed or ID..."
                    />

                    <div className="filters">
                        <FilterDropdown
                            value={speciesFilter}
                            options={speciesFilterOptions}
                            onChange={setSpeciesFilter}
                            icon={<PawPrint />}
                        />

                        <FilterDropdown
                            value={statusFilter}
                            options={statusFilterOptions}
                            onChange={setStatusFilter}
                            icon={<Bell />}
                        />

                        <FilterDropdown
                            value={sortOrder}
                            options={sortFilterOptions}
                            onChange={setSortOrder}
                            icon={<ListFilter />}
                        />
                    </div>

                    <NavigationButton
                        label="Create Listing"
                        to={routes.home.createListing}
                        icon={<Plus />}
                    />
                </div>
            </div>
        </main>
    );
}
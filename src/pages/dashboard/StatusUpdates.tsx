import { useEffect, useState } from "react";

import { useOrganisationProfile } from "../../context/OrganisationProfileContext";
import { routes } from "../../constants/routes";
import { useNavigate } from "react-router-dom";

import { Bell, ListFilter, PawPrint } from "lucide-react";

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

export default function StatusUpdates() {

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
        document.title = "Status Updates | PetPath";

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
                    <h1>Status Updates</h1>

                    <p>
                        Check your pet listing's status.
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
                </div>
            </div>
        </main>
    );
}
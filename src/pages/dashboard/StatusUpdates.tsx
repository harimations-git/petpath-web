import {
    Bell,
    ListFilter,
    PawPrint,
} from "lucide-react";

import {
    sortFilterOptions,
    speciesFilterOptions,
    reviewStatusFilterOptions,
} from "../../data/listingFilters";

import { useNavigate } from "react-router-dom";

import SearchBar from "../../components/ui/filters/SearchBar";
import FilterDropdown from "../../components/ui/filters/FilterDropdown";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import OrganisationAccountMenu from "../../components/ui/profile/OrganisationAccountMenu";
import StatusUpdateCard from "../../components/ui/listings/status/StatusUpdateCard";

import { routes } from "../../constants/routes";
import { useStatusUpdates } from "../../hooks/useStatusUpdates";

import "./MyListings.css";
import "./PageHeading.css";
import "./StatusUpdates.css";

export default function StatusUpdates() {
    const navigate = useNavigate();

    const {
        isLoadingProfile,
        profileError,

        filteredUpdates,
        isLoadingUpdates,
        updatesError,
        statistics,

        searchQuery,
        setSearchQuery,

        speciesFilter,
        setSpeciesFilter,

        reviewStatusFilter,
        setReviewStatusFilter,

        sortOrder,
        setSortOrder,
    } = useStatusUpdates();

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
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>Review updates</h1>

                    <p>
                        Track listing reviews, admin feedback and any
                        changes that need your attention.
                    </p>
                </div>

                <div className="page-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <section className="review-update-summary">
                <article>
                    <span>Pending review</span>
                    <strong>{statistics.pending}</strong>
                </article>

                <article>
                    <span>Action needed</span>
                    <strong>{statistics.rejected}</strong>
                </article>

                <article>
                    <span>Approved</span>
                    <strong>{statistics.approved}</strong>
                </article>
            </section>

            <div className="my-listings-filters">
                <div className="filters-row">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by title"
                    />

                    <div className="filters">
                        <FilterDropdown
                            value={speciesFilter}
                            options={speciesFilterOptions}
                            onChange={setSpeciesFilter}
                            icon={<PawPrint />}
                        />

                        <FilterDropdown
                            value={reviewStatusFilter}
                            options={reviewStatusFilterOptions}
                            onChange={(value) =>
                                setReviewStatusFilter(
                                    value as typeof reviewStatusFilter
                                )
                            }
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

            {isLoadingUpdates && (
                <LoadingSpinner
                    size="large"
                    label="Loading review updates..."
                />
            )}

            {updatesError && (
                <p className="dashboard-error">
                    {updatesError}
                </p>
            )}

            {!isLoadingUpdates &&
                !updatesError &&
                filteredUpdates.length === 0 && (
                    <section className="review-updates-empty">
                        <h2>No review updates found</h2>

                        <p>
                            When listings are pending, approved or rejected,
                            they will appear here.
                        </p>
                    </section>
                )}

            {!isLoadingUpdates &&
                filteredUpdates.length > 0 && (
                    <section className="review-updates-list">
                        {filteredUpdates.map((listing) => (
                            <StatusUpdateCard
                                key={listing.listingId}
                                listing={listing}
                                onView={(listingId) =>
                                    navigate(
                                        routes.listings.viewListing(
                                            listingId
                                        )
                                    )
                                }
                            />
                        ))}
                    </section>
                )}
        </main>
    );
}
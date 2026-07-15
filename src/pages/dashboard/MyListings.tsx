import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import OrganisationAccountMenu from "../../components/ui/profile/OrganisationAccountMenu";

import { useMyListings } from "../../hooks/useMyListings";

import { routes } from "../../constants/routes";

import "./MyListings.css";
import "./PageHeading.css";
import MyListingsFilters from "../../components/ui/listings/SearchFilters";
import MyListingsResults from "../../components/ui/listings/MyListingResults";

export default function MyListings() {
    const navigate = useNavigate();

    const {
        isLoadingProfile,
        profileError,

        listings,
        filteredListings,

        hasMoreListings,
        hasActiveFilters,
        isSearchingAllListings,

        isLoadingListings,
        isLoadingMoreListings,
        listingsError,

        loadListings,
        loadMoreListings,

        searchQuery,
        setSearchQuery,

        speciesFilter,
        setSpeciesFilter,

        listingTypeFilter,
        setListingTypeFilter,

        statusFilter,
        setStatusFilter,

        sortOrder,
        setSortOrder,
    } = useMyListings();

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
            <main className="page-body">
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
                    <h1>My Listings</h1>

                    <p>
                        Manage, edit and review your current pet listings.
                    </p>
                </div>

                <div className="page-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <MyListingsFilters
                searchQuery={
                    searchQuery
                }
                onSearchChange={
                    setSearchQuery
                }
                speciesFilter={
                    speciesFilter
                }
                onSpeciesChange={
                    setSpeciesFilter
                }
                listingTypeFilter={
                    listingTypeFilter
                }
                onListingTypeChange={
                    setListingTypeFilter
                }
                statusFilter={
                    statusFilter
                }
                onStatusChange={
                    setStatusFilter
                }
                sortOrder={
                    sortOrder
                }
                onSortChange={
                    setSortOrder
                }
            />

            <MyListingsResults
                listings={
                    filteredListings
                }
                totalLoadedListings={
                    listings.length
                }
                isLoading={
                    isLoadingListings
                }
                isLoadingMore={
                    isLoadingMoreListings
                }
                isSearchingAllListings={
                    isSearchingAllListings
                }
                error={
                    listingsError
                }
                hasMore={
                    hasMoreListings &&
                    !hasActiveFilters
                }
                onRetry={
                    loadListings
                }
                onLoadMore={
                    loadMoreListings
                }
                onViewListing={(
                    listingId
                ) =>
                    navigate(
                        `${routes.home.myListings}/${listingId}`
                    )
                }
            />
        </main>
    );
}
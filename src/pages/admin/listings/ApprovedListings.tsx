import {
    Search,
    ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import AdminAccountMenu from "../../../components/ui/admin/profile/AdminAccountMenu";
import { useApprovedListings } from "../../../hooks/admin/useApprovedListings";
import { routes } from "../../../constants/routes";

import "./PendingListings.css";
import type { ApprovedListing } from "../../../types/admin/adminListing";
import ApprovedListingCard from "../../../components/ui/admin/listings/details/pet_card/ApprovedListingCards";
import CardList from "../../../components/ui/CardList";

export default function ApprovedListings() {
    const navigate = useNavigate();

    const {
        displayedListings,

        searchQuery,
        setSearchQuery,

        sortOrder,
        setSortOrder,

        isLoading,
        isLoadingMore,

        error,
        hasMore,

        loadMore,
        retry,
    } = useApprovedListings();

    function handleViewListing(listing: ApprovedListing) {
        navigate(routes.admin.listings.listingReview(listing.listingId));
    }

    return (
        <main className="page-body admin-listings-page">
            <header className="page-header">
                <div className="page-heading">
                    <h1>
                        Approved Pet Listings
                    </h1>

                    <p>
                        View all approved pet
                        listings, including
                        available, reserved and
                        rehomed listings.
                    </p>
                </div>

                <div className="page-account-menu">
                    <AdminAccountMenu />
                </div>
            </header>

            <div className="approved-listings-overview">
                <Card className="approved-listings-controls">
                    <div className="admin-listings-search">
                        <label htmlFor="approved-listing-search">
                            Search listings
                        </label>

                        <div className="admin-listings-search-input">
                            <Search size={18} />

                            <input
                                id="approved-listing-search"
                                type="search"
                                value={searchQuery}
                                placeholder="Search loaded listings"
                                onChange={(event) =>
                                    setSearchQuery(
                                        event.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="admin-listings-sort">
                        <label htmlFor="approved-listing-sort">
                            Sort listings
                        </label>

                        <select
                            id="approved-listing-sort"
                            value={sortOrder}
                            onChange={(event) =>
                                setSortOrder(
                                    event.target.value ===
                                        "oldest"
                                        ? "oldest"
                                        : "newest"
                                )
                            }
                        >
                            <option value="newest">
                                Newest first
                            </option>

                            <option value="oldest">
                                Oldest first
                            </option>
                        </select>
                    </div>
                </Card>
            </div>

            <section className="admin-listings-results">
                <div className="admin-listings-results-header">
                    <div>
                        <h2>
                            Approved listings
                        </h2>

                        <p>
                            {displayedListings.length}
                            {" "}
                            {displayedListings.length === 1
                                ? "listing"
                                : "listings"}
                            {" "}loaded
                        </p>
                    </div>
                </div>

                {error && (
                    <Card className="admin-listings-error">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() => void retry()}
                        >
                            Try again
                        </button>
                    </Card>
                )}

                {isLoading ? (
                    <Card className="admin-listings-empty">
                        <LoadingSpinner size="large" />

                        <p>Loading listings...</p>
                    </Card>
                ) : displayedListings.length > 0 ? (
                    <CardList
                        hasMore={hasMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={() => void loadMore()}
                    >
                        {displayedListings.map(
                            (listing) => (
                                <ApprovedListingCard
                                    key={listing.listingId}
                                    listing={listing}
                                    onView={handleViewListing}
                                />
                            )
                        )}
                    </CardList>
                ) : (
                    <Card className="admin-listings-empty">
                        <ShieldCheck size={34} />

                        <strong>
                            No listings found
                        </strong>

                        <p>
                            No approved listings
                            match your current
                            search.
                        </p>
                    </Card>
                )}
            </section>
        </main>
    );
}
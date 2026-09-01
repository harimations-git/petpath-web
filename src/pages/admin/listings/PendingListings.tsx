import { ClipboardCheck, Clock3, Search, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import AdminAccountMenu from "../../../components/ui/admin/profile/AdminAccountMenu";
import PendingListingCard from "../../../components/ui/admin/listings/details/pet_card/PendingListingCard";
import { usePendingListings } from "../../../hooks/admin/usePendingListings";
import { formatDate } from "../../../utils/listings/displayFormatting";
import { routes } from "../../../constants/routes";
import type { PendingListing } from "../../../types/admin/adminListing";
import "./PendingListings.css";
import CardList from "../../../components/ui/CardList";

/**
 * Displays pet listings that are waiting for admin review.
 * Handles searching, sorting, pagination and navigation to listing details.
 */
export default function PendingListings() {
    const navigate = useNavigate();

    const {
        displayedListings,

        pendingCount,
        oldestSubmittedAt,

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
    } = usePendingListings();

    //Open the selected listing in the admin review page
    function handleViewListing(listing: PendingListing) {
        navigate(routes.admin.listings.listingReview(listing.listingId));
    }

    return (
        <main className="page-body admin-listings-page">
            <header className="page-header">
                <div className="page-heading">
                    <h1>
                        Pending Pet Listings
                    </h1>

                    <p>
                        Review submitted pet listings
                        before they become visible to
                        PetPath users.
                    </p>
                </div>

                <div className="page-account-menu">
                    <AdminAccountMenu />
                </div>
            </header>

            <section className="admin-listings-statistics">
                <Card className="admin-listings-controls">
                    <div className="admin-listings-search">
                        <label htmlFor="listing-search">
                            Search listings
                        </label>

                        <div className="admin-listings-search-input">
                            <Search size={18} />

                            <input
                                id="listing-search"
                                type="search"
                                value={searchQuery}
                                placeholder="Search loaded listings"
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="admin-listings-sort">
                        <label htmlFor="listing-sort">
                            Sort listings
                        </label>

                        <select
                            id="listing-sort"
                            value={sortOrder}
                            onChange={(event) =>
                                setSortOrder(event.target.value === "newest" ? "newest" : "oldest")
                            }
                        >
                            <option value="oldest">
                                Oldest first
                            </option>

                            <option value="newest">
                                Newest first
                            </option>
                        </select>
                    </div>
                </Card>

                <Card className="admin-listings-statistic-card">
                    <div className="admin-listings-statistic-icon">
                        <ClipboardCheck
                            size={22}
                        />
                    </div>

                    <div className="admin-listings-statistic-text">
                        <span>
                            Awaiting review
                        </span>

                        <strong>
                            {pendingCount}
                        </strong>
                    </div>
                </Card>

                <Card className="admin-listings-statistic-card">
                    <div className="admin-listings-statistic-icon">
                        <Clock3 size={22} />
                    </div>

                    <div className="admin-listings-statistic-text">
                        <span>
                            Oldest submission
                        </span>

                        <strong>
                            {oldestSubmittedAt ? formatDate(oldestSubmittedAt) : "None"}
                        </strong>
                    </div>
                </Card>
            </section>

            <section className="admin-listings-results">
                <div className="admin-listings-results-header">
                    <div>
                        <h2>
                            Pending listings
                        </h2>

                        <p>
                            {displayedListings.length}{" "}
                            {displayedListings.length === 1 ? "listing" : "listings"}{" "}
                            loaded
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
                                <PendingListingCard
                                    key={listing.listingId}
                                    listing={listing}
                                    onView={handleViewListing}
                                />
                            )
                        )}
                    </CardList>
                ) : (
                    <Card className="admin-listings-empty">
                        <ShieldCheck
                            size={34}
                        />

                        <strong>
                            No listings found
                        </strong>

                        <p>
                            No pending listings
                            match your current search.
                        </p>
                    </Card>
                )}
            </section>
        </main>
    );
}
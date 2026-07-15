import { ChevronDown, LoaderCircle, PawPrint } from "lucide-react";

import LoadingSpinner from "../LoadingSpinner";


import type {
    PetListingSummary,
} from "../../../types/listing";
import PetListingCard from "./PetListingCard";

import "./MyListingResults.css";

type MyListingsResultsProps = {
    listings: PetListingSummary[];
    totalLoadedListings: number;

    isLoading: boolean;
    isLoadingMore: boolean;
    isSearchingAllListings: boolean;

    error: string;
    hasMore: boolean;

    onRetry: () => void;
    onLoadMore: () => void;
    onViewListing: (
        listingId: string
    ) => void;
};

export default function MyListingsResults({
    listings,
    totalLoadedListings,
    isLoading,
    isLoadingMore,
    isSearchingAllListings,
    error,
    hasMore,
    onRetry,
    onLoadMore,
    onViewListing,
}: MyListingsResultsProps) {
    if (
        isLoading &&
        totalLoadedListings === 0
    ) {
        return (
            <section className="my-listings-results">
                <LoadingSpinner
                    size="large"
                    label="Loading your listings..."
                />
            </section>
        );
    }

    if (
        error &&
        totalLoadedListings === 0
    ) {
        return (
            <section className="my-listings-results">
                <div className="my-listings-message">
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={onRetry}
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    if (listings.length === 0) {
        return (
            <section className="my-listings-results">
                <div className="my-listings-empty">
                    <PawPrint size={30} />

                    <h2>
                        No listings found
                    </h2>

                    <p>
                        {totalLoadedListings === 0
                            ? "Create your first pet listing to get started."
                            : "No listings match your current filters."}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="my-listings-results">
            {isSearchingAllListings && (
                <div
                    className="my-listings-filter-loading"
                    role="status"
                >
                    <LoaderCircle
                        size={17}
                        className="my-listings-load-more-spinner"
                    />

                    <span>
                        Searching all of your listings...
                    </span>
                </div>
            )}
            <div className="my-listings-grid">
                {listings.map((listing) => (
                    <PetListingCard
                        key={
                            listing.listingId
                        }
                        listing={listing}
                        onView={
                            onViewListing
                        }
                    />
                ))}
            </div>

            {/*Will change when I have time to do pages*/}
            {hasMore && (
                <div className="my-listings-load-more">
                    <span className="my-listings-load-more-line" />

                    <button
                        type="button"
                        className="my-listings-load-more-button"
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        aria-busy={isLoadingMore}
                    >
                        {isLoadingMore ? (
                            <LoaderCircle
                                size={18}
                                className="my-listings-load-more-spinner"
                            />
                        ) : (
                            <ChevronDown size={18} />
                        )}

                        <span>
                            {isLoadingMore
                                ? "Loading listings"
                                : "Load more listings"}
                        </span>
                    </button>

                    <span className="my-listings-load-more-line" />
                </div>
            )}

            {error && (
                <p className="my-listings-error">
                    {error}
                </p>
            )}
        </section>
    );
}
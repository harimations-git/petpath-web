import { PawPrint } from "lucide-react";

import LoadingSpinner from "../LoadingSpinner";


import type {
    PetListingSummary,
} from "../../../types/listing";
import PetListingCard from "./PetListingCard";

type MyListingsResultsProps = {
    listings: PetListingSummary[];
    totalLoadedListings: number;

    isLoading: boolean;
    isLoadingMore: boolean;

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
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={
                            isLoadingMore
                        }
                    >
                        {isLoadingMore
                            ? "Loading..."
                            : "Load more"}
                    </button>
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
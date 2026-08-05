import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { getPendingListings } from "../../services/admin/adminListingService";
import type { PendingListing } from "../../types/admin/adminListing";
import type { SortOrder } from "../../types/filters";

/**
 * Manages the pending pet listings page.
 */
export function usePendingListings() {
    const [listings, setListings] = useState<PendingListing[]>([]);

    const [nextToken, setNextToken] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("oldest");

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState("");

    /**
     * Loads the first page of pending listings.
     *
     * This runs again whenever the sort order changes.
     */
    const loadListings =
        useCallback(async () => {
            setIsLoading(true);
            setError("");
            setNextToken(null);

            try {
                const data = await getPendingListings(sortOrder);

                setListings(data.listings);

                setNextToken(data.nextToken);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load pending listings."
                );
            } finally {
                setIsLoading(false);
            }
        }, [sortOrder]);

    /**
     * Loads the first page when the hook mounts
     * and whenever the sort order changes.
     */
    useEffect(() => {
        void loadListings();
    }, [loadListings]);

    /**
     * Loads the next DynamoDB page.
     */
    const loadMore =
        useCallback(async () => {
            if (!nextToken || isLoadingMore) {
                return;
            }

            setIsLoadingMore(true);
            setError("");

            try {
                const data = await getPendingListings(sortOrder, nextToken);

                setListings(
                    (currentListings) => {
                        const existingIds =
                            new Set(
                                currentListings.map(
                                    (listing) =>
                                        listing.listingId
                                )
                            );

                        const newListings =
                            data.listings.filter(
                                (listing) =>
                                    !existingIds.has(
                                        listing.listingId
                                    )
                            );

                        return [
                            ...currentListings,
                            ...newListings,
                        ];
                    }
                );

                setNextToken(data.nextToken);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load more listings."
                );
            } finally {
                setIsLoadingMore(false);
            }
        }, [
            isLoadingMore,
            nextToken,
            sortOrder,
        ]);

    /**
     * Applies the search query to listings
     * that have currently been loaded.
     */
    const displayedListings =
        useMemo(() => {
            const normalisedSearch = searchQuery.trim().toLowerCase();

            if (!normalisedSearch) {
                return listings;
            }

            return listings.filter(
                (listing) =>
                    [
                        listing.title,
                        listing.organisationName,
                        listing.animalType,
                        listing.listingType,
                    ].some(
                        (value) =>
                            value.toLowerCase().includes(normalisedSearch)
                    )
            );
        }, [
            listings,
            searchQuery,
        ]);

    /**
     * Finds the oldest currently loaded listing.
     */
    const oldestSubmittedAt =
        useMemo(() => {
            if (listings.length === 0) {
                return null;
            }

            const oldestListing =
                listings.reduce(
                    (currentOldest, listing) => {
                        const currentTime = new Date(currentOldest.submittedAt).getTime();
                        const listingTime = new Date(listing.submittedAt).getTime();

                        return listingTime < currentTime ? listing : currentOldest;
                    }
                );

            return oldestListing.submittedAt;
        }, [listings]);

    return {
        listings,
        displayedListings,

        pendingCount: listings.length,

        oldestSubmittedAt,

        searchQuery,
        setSearchQuery,

        sortOrder,
        setSortOrder,

        isLoading,
        isLoadingMore,

        error,

        hasMore: Boolean(nextToken),

        loadMore,

        retry: loadListings,
    };
}
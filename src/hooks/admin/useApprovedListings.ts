import { useCallback, useEffect, useMemo, useState } from "react";
import { getApprovedListings } from "../../services/admin/adminListingService";
import type { ApprovedListing } from "../../types/admin/adminListing";
import type { SortOrder } from "../../types/filters";

/**
 * Manages the approved listings page.
 * Handles loading, pagination, searching, sorting and listing statistics.
 */
export function useApprovedListings() {
    const [listings, setListings] = useState<ApprovedListing[]>([]);

    const [nextToken, setNextToken] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [error, setError] = useState("");

    //Load the first page of approved listings
    const loadListings =
        useCallback(async () => {
            setIsLoading(true);
            setError("");

            try {
                const result = await getApprovedListings({ sortOrder });

                setListings(result.listings);

                //Check if there are any listings left to load
                setNextToken(result.nextToken ?? null);
            } catch (loadError) {
                setListings([]);
                setNextToken(null);

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load approved listings."
                );
            } finally {
                setIsLoading(false);
            }
        }, [sortOrder]);

    useEffect(() => {
        document.title = "All Listings | PetPath";
    }, []);

    //Load the listings when the page opens or when loadListings is called
    useEffect(() => {
        void loadListings();
    }, [loadListings]);

    //10 more listings are loaded if there is an available token
    const loadMore =
        useCallback(async () => {
            //return if no token or is already loading more
            if (!nextToken || isLoadingMore) {
                return;
            }

            setIsLoadingMore(true);
            setError("");

            try {
                const result = await getApprovedListings({ sortOrder, nextToken });

                //Use a map to avoid duplicate listings
                setListings(
                    (currentListings) => {
                        const listingById =
                            new Map(currentListings.map(
                                (listing) => [listing.listingId, listing]
                            )
                            );

                        //Add or replace listings returned in the next page
                        for (const listing of result.listings) {
                            listingById.set(listing.listingId, listing);
                        }

                        return [
                            ...listingById.values(),
                        ];
                    }
                );

                setNextToken(result.nextToken ?? null);
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

    //Displays the listings that match the search query, if there is no query, return default list
    const displayedListings =
        useMemo(() => {
            //clean the query
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
                        listing.availabilityStatus,
                    ].some((value) =>
                        value.toLowerCase().includes(normalisedSearch)
                    )
            );
        }, [listings, searchQuery]);

    //Get the number of pets available
    const availableCount =
        useMemo(() =>
            //filter available listings then get the length
            listings.filter((listing) =>
                listing.availabilityStatus === "available"
            ).length,
            [listings]
        );

    //Get the number of reserved pets
    const reservedCount =
        useMemo(
            () =>
                listings.filter((listing) =>
                    listing.availabilityStatus === "reserved"
                ).length, //get the length for the stat count
            [listings]
        );

    //Get the number of rehomed pets
    const rehomedCount =
        useMemo(
            () =>
                listings.filter((listing) =>
                    listing.availabilityStatus === "rehomed"
                ).length,
            [listings]
        );

    return {
        displayedListings,

        approvedCount: listings.length,

        availableCount,
        reservedCount,
        rehomedCount,

        searchQuery,
        setSearchQuery,

        sortOrder,
        setSortOrder,

        isLoading,
        isLoadingMore,

        error,

        hasMore: Boolean(nextToken), //true or false

        loadMore,

        retry: loadListings,
    };
}
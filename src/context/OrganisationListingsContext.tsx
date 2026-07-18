import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    getOrganisationListings,
} from "../services/listings/listingService";

import type {
    GetOrganisationListingsResponse,
    PetListingSummary,
} from "../types/listing";

type OrganisationListingsContextValue = {
    listings: PetListingSummary[];

    nextToken: string | null;
    hasMoreListings: boolean;

    isLoadingListings: boolean;
    isLoadingMoreListings: boolean;

    listingsError: string;

    loadListings: () => Promise<void>;
    loadMoreListings: () => Promise<void>;
    refreshListings: () => Promise<void>;
    clearCachedListings: () => void;
};

type OrganisationListingsProviderProps = {
    children: ReactNode;
};

const OrganisationListingsContext =
    createContext<
        OrganisationListingsContextValue | null
    >(null);

const LISTINGS_PAGE_SIZE = 12;

const CACHE_DURATION =
    5 * 60 * 1000;

/*
 * Module-level cache.
 *
 * This survives page navigation while the React
 * application remains open.
 */
let cachedListings: PetListingSummary[] = [];

let cachedNextToken: string | null = null;

let listingsCachedAt = 0;

let hasLoadedListings = false;

/*
 * Prevent Dashboard and My Listings from creating
 * the same request at the same time.
 */
let pendingListingsRequest:
    Promise<GetOrganisationListingsResponse> | null =
    null;

function cacheIsFresh() {
    return (
        hasLoadedListings &&
        Date.now() - listingsCachedAt <
        CACHE_DURATION
    );
}

export function OrganisationListingsProvider({
    children,
}: OrganisationListingsProviderProps) {
    const [listings, setListings] =
        useState<PetListingSummary[]>(
            cachedListings
        );

    const [nextToken, setNextToken] =
        useState<string | null>(
            cachedNextToken
        );

    const [
        isLoadingListings,
        setIsLoadingListings,
    ] = useState(false);

    const [
        isLoadingMoreListings,
        setIsLoadingMoreListings,
    ] = useState(false);

    const [
        listingsError,
        setListingsError,
    ] = useState("");

    const loadListings = useCallback(
        async () => {
            setListingsError("");

            /*
             * Use the cache when it is still fresh.
             */
            if (cacheIsFresh()) {
                setListings(cachedListings);
                setNextToken(
                    cachedNextToken
                );

                return;
            }

            setIsLoadingListings(true);

            try {
                /*
                 * Reuse an existing request when another
                 * page is already loading the listings.
                 */
                if (!pendingListingsRequest) {
                    pendingListingsRequest =
                        getOrganisationListings({
                            limit:
                                LISTINGS_PAGE_SIZE,
                        });
                }

                const result =
                    await pendingListingsRequest;

                cachedListings =
                    result.listings;

                cachedNextToken =
                    result.nextToken;

                listingsCachedAt =
                    Date.now();

                hasLoadedListings = true;

                setListings(
                    result.listings
                );

                setNextToken(
                    result.nextToken
                );
            } catch (error) {
                console.error(
                    "Unable to load listings:",
                    error
                );

                setListingsError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load your pet listings."
                );
            } finally {
                pendingListingsRequest =
                    null;

                setIsLoadingListings(false);
            }
        },
        []
    );

    const loadMoreListings =
        useCallback(async () => {
            if (
                !nextToken ||
                isLoadingMoreListings
            ) {
                return;
            }

            setListingsError("");
            setIsLoadingMoreListings(true);

            try {
                const result =
                    await getOrganisationListings({
                        limit:
                            LISTINGS_PAGE_SIZE,

                        nextToken,
                    });

                setListings(
                    (currentListings) => {
                        /*
                         * Avoid duplicate listings if the
                         * same page is requested twice.
                         */
                        const existingIds =
                            new Set(
                                currentListings.map(
                                    (listing) =>
                                        listing.listingId
                                )
                            );

                        const newListings =
                            result.listings.filter(
                                (listing) =>
                                    !existingIds.has(
                                        listing.listingId
                                    )
                            );

                        const combinedListings = [
                            ...currentListings,
                            ...newListings,
                        ];

                        cachedListings =
                            combinedListings;

                        return combinedListings;
                    }
                );

                cachedNextToken =
                    result.nextToken;

                listingsCachedAt =
                    Date.now();

                setNextToken(
                    result.nextToken
                );
            } catch (error) {
                console.error(
                    "Unable to load more listings:",
                    error
                );

                setListingsError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load more listings."
                );
            } finally {
                setIsLoadingMoreListings(false);
            }
        }, [
            nextToken,
            isLoadingMoreListings,
        ]);

    const refreshListings =
        useCallback(async () => {
            /*
             * Clear the cached listing state so the
             * next load is definitely fresh.
             */
            cachedListings = [];
            cachedNextToken = null;
            listingsCachedAt = 0;
            hasLoadedListings = false;
            pendingListingsRequest = null;

            setListings([]);
            setNextToken(null);
            setListingsError("");

            await loadListings();
        }, [loadListings]);

    const clearCachedListings =
        useCallback(() => {
            cachedListings = [];
            cachedNextToken = null;
            listingsCachedAt = 0;
            hasLoadedListings = false;
            pendingListingsRequest = null;

            setListings([]);
            setNextToken(null);
            setListingsError("");
        }, []);

    const contextValue = useMemo(
        () => ({
            listings,

            nextToken,

            hasMoreListings:
                nextToken !== null,

            isLoadingListings,
            isLoadingMoreListings,

            listingsError,

            loadListings,
            loadMoreListings,
            refreshListings,
            clearCachedListings,
        }),
        [
            listings,
            nextToken,
            isLoadingListings,
            isLoadingMoreListings,
            listingsError,
            loadListings,
            loadMoreListings,
            refreshListings,
            clearCachedListings,
        ]
    );

    return (
        <OrganisationListingsContext.Provider
            value={contextValue}
        >
            {children}
        </OrganisationListingsContext.Provider>
    );
}

export function useOrganisationListings() {
    const context = useContext(
        OrganisationListingsContext
    );

    if (!context) {
        throw new Error(
            "OrganisationListingsProvider was not found."
        );
    }

    return context;
}
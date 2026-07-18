import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useOrganisationProfile } from "../context/OrganisationProfileContext";
import { useOrganisationListings } from "../context/OrganisationListingsContext";
import { updateListingAvailability } from "../services/listings/listingService";
import type { ListingAvailabilityStatus } from "../types/listing";

import { routes } from "../constants/routes";

export function useMyListings() {
    const navigate = useNavigate();

    //get profile
    const {
        organisationProfile,
        isLoadingProfile,
        profileError,
    } = useOrganisationProfile();

    //get listing data
    const {
        listings,
        hasMoreListings,
        isLoadingListings,
        isLoadingMoreListings,
        listingsError,
        loadListings,
        loadMoreListings,
        refreshListings,
    } = useOrganisationListings();

    //current filters
    const [searchQuery, setSearchQuery] = useState("");
    const [speciesFilter, setSpeciesFilter] = useState("all");
    const [listingTypeFilter, setListingTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    //checks if the user has active filters
    const hasActiveFilters =
        searchQuery.trim() !== "" ||
        speciesFilter !== "all" ||
        listingTypeFilter !== "all" ||
        statusFilter !== "all";

    /**
     * checks if the app is loading those aditional listing so 
     * those filters can search through them
    */
    const isSearchingAllListings =
        hasActiveFilters &&
        (
            hasMoreListings ||
            isLoadingMoreListings
        );

    const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState<string | null>(null);

    //allows the user to change the availability status of a pet
    async function handleAvailabilityChange(
        listingId: string,
        availabilityStatus: ListingAvailabilityStatus
    ) {
        setUpdatingAvailabilityId(listingId);

        try {
            await updateListingAvailability(
                listingId,
                availabilityStatus
            );

            await refreshListings();
        } finally {
            setUpdatingAvailabilityId(null);
        }
    }

    useEffect(() => {
        document.title =
            "My Listings | PetPath";
    }, []);

    //check account status
    useEffect(() => {
        if (!organisationProfile) {
            return;
        }

        if (
            organisationProfile.accountStatus ===
            "pending"
        ) {
            navigate(
                routes.auth.accountReview,
                {
                    replace: true,
                }
            );

            return;
        }

        if (
            organisationProfile.accountStatus !==
            "approved"
        ) {
            navigate(
                routes.auth.login,
                {
                    replace: true,
                }
            );
        }
    },
        [organisationProfile, navigate]
    );

    useEffect(() => {
        if (
            organisationProfile?.accountStatus ===
            "approved"
        ) {
            loadListings();
        }
    },
        [organisationProfile?.accountStatus, loadListings] //runs when the account status or loadlistings change 
    );

    /**
     * automatically load every remaining page of listings 
     * whenever a search or filter is active.
     */
    useEffect(() => {
        if (
            !hasActiveFilters ||
            !hasMoreListings ||
            isLoadingMoreListings ||
            listingsError
        ) {
            return;
        }

        void loadMoreListings();
    }, [
        hasActiveFilters,
        hasMoreListings,
        isLoadingMoreListings,
        listingsError,
        loadMoreListings,
        listings.length,
    ]);


    /*Filter and searching
     *useMemo stores the calculated result until one of the dependencies change 
     */
    const filteredListings = useMemo(() => {
        const search = searchQuery.trim().toLowerCase();

        const filtered = listings.filter(
            (listing) => {

                //search matching
                const matchesSearch =
                    !search ||
                    listing.title
                        .toLowerCase()
                        .includes(search)

                //animal type filtering
                const matchesSpecies =
                    speciesFilter === "all" ||
                    listing.animalType
                        ?.trim()
                        .toLowerCase() === speciesFilter;

                //listing type filtering
                const matchesListingType =
                    listingTypeFilter === "all" ||
                    listing.listingType === listingTypeFilter;

                /**
                 * Pending review takes prioritiy over availability
                 * E.g a listing could be available but it's pending
                 * so the code treats its filter status as pending
                 */
                const listingStatus =
                    listing.reviewStatus ===
                        "pending"
                        ? "pending"
                        : listing.availabilityStatus;

                //Status filtering
                const matchesStatus =
                    statusFilter === "all" ||
                    listingStatus ===
                    statusFilter;

                return (
                    matchesSearch &&
                    matchesSpecies &&
                    matchesListingType &&
                    matchesStatus
                );
            }
        );

        //sorts by creation date
        return [...filtered].sort(
            (firstListing, secondListing) => {
                switch (sortOrder) {
                    case "oldest":
                        return (
                            new Date(
                                firstListing.createdAt
                            ).getTime() -
                            new Date(
                                secondListing.createdAt
                            ).getTime()
                        );

                    case "name-asc":
                        return firstListing.title.localeCompare(
                            secondListing.title,
                            undefined,
                            {
                                sensitivity: "base",
                            }
                        );

                    case "name-desc":
                        return secondListing.title.localeCompare(
                            firstListing.title,
                            undefined,
                            {
                                sensitivity: "base",
                            }
                        );

                    case "newest":
                    default:
                        return (
                            new Date(
                                secondListing.createdAt
                            ).getTime() -
                            new Date(
                                firstListing.createdAt
                            ).getTime()
                        );
                }
            }
        );
    }, [
        listings,
        searchQuery,
        speciesFilter,
        listingTypeFilter,
        statusFilter,
        sortOrder,
    ]);

    return {
        organisationProfile,
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

        updatingAvailabilityId,
        handleAvailabilityChange,

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
    };
}
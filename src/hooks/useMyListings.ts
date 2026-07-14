import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useOrganisationProfile } from "../context/OrganisationProfileContext";
import { useOrganisationListings } from "../context/OrganisationListingsContext";

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
    } = useOrganisationListings();

    //current filters
    const [searchQuery, setSearchQuery] = useState("");
    const [speciesFilter, setSpeciesFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

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
                    listing.animalType === speciesFilter;


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
                    matchesStatus
                );
            }
        );

        //sorts by creation date
        return [...filtered].sort(
            (firstListing, secondListing) => {
                const firstDate =
                    new Date(
                        firstListing.createdAt
                    ).getTime();

                const secondDate =
                    new Date(
                        secondListing.createdAt
                    ).getTime();

                return sortOrder === "oldest"
                    ? firstDate - secondDate
                    : secondDate - firstDate;
            }
        );
    }, [
        listings,
        searchQuery,
        speciesFilter,
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
        isLoadingListings,
        isLoadingMoreListings,
        listingsError,

        loadListings,
        loadMoreListings,

        searchQuery,
        setSearchQuery,

        speciesFilter,
        setSpeciesFilter,

        statusFilter,
        setStatusFilter,

        sortOrder,
        setSortOrder,
    };
}
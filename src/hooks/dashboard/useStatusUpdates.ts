import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useOrganisationProfile,
} from "../../context/OrganisationProfileContext";

import {
    useOrganisationListings,
} from "../../context/OrganisationListingsContext";

import {
    routes,
} from "../../constants/routes";

type ReviewStatusFilter =
    | "all"
    | "pending"
    | "approved"
    | "rejected";

export function useStatusUpdates() {
    const navigate = useNavigate();

    const {organisationProfile, isLoadingProfile, profileError} = useOrganisationProfile();

    const {
        reviewUpdates,
        isLoadingReviewUpdates,
        reviewUpdatesError,
        loadReviewUpdates,
        refreshReviewUpdates,
    } = useOrganisationListings();

    const [searchQuery, setSearchQuery] = useState("");
    const [speciesFilter, setSpeciesFilter] = useState("all");
    const [reviewStatusFilter, setReviewStatusFilter] = useState<ReviewStatusFilter>("all");
    const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        document.title = "Review Updates | PetPath";

        if (!organisationProfile) {
            return;
        }

        if (organisationProfile.accountStatus === "pending") {
            navigate(
                routes.auth.accountReview,
                {
                    replace: true,
                }
            );

            return;
        }

        if (organisationProfile.accountStatus !=="approved") {
            navigate(
                routes.auth.login,
                {
                    replace: true,
                }
            );
        }
    }, [
        organisationProfile,
        navigate,
    ]);

    useEffect(() => {
        if (
            !organisationProfile ||
            organisationProfile.accountStatus !==
            "approved"
        ) {
            return;
        }

        void loadReviewUpdates();
    }, [
        organisationProfile,
        loadReviewUpdates,
    ]);

    const filteredUpdates =
        useMemo(() => {
            const normalisedSearch =
                searchQuery.trim().toLowerCase();

            function getReviewPriority(
                listing: typeof reviewUpdates[number]
            ) {
                if (listing.reviewStatus === "rejected") {
                    return 0;
                }

                if (listing.reviewStatus === "pending") {
                    return 1;
                }

                if (listing.reviewStatus === "approved") {
                    return 2;
                }

                return 3;
            }

            return reviewUpdates
                .filter((listing) => {
                    const matchesSearch =
                        normalisedSearch === "" ||
                        listing.title
                            .toLowerCase()
                            .includes(normalisedSearch);

                    const matchesSpecies =
                        speciesFilter === "all" ||
                        listing.animalType ===
                        speciesFilter;

                    const matchesReviewStatus =
                        reviewStatusFilter === "all" ||
                        listing.reviewStatus ===
                        reviewStatusFilter;

                    return (
                        matchesSearch &&
                        matchesSpecies &&
                        matchesReviewStatus
                    );
                })
                .sort((first, second) => {
                    const priorityDifference =
                        getReviewPriority(first) -
                        getReviewPriority(second);

                    if (priorityDifference !== 0) {
                        return priorityDifference;
                    }

                    const firstDate =
                        new Date(
                            first.updatedAt ??
                            first.createdAt
                        ).getTime();

                    const secondDate =
                        new Date(
                            second.updatedAt ??
                            second.createdAt
                        ).getTime();

                    switch (sortOrder) {
                        case "oldest":
                            return firstDate - secondDate;

                        case "name-asc":
                            return first.title.localeCompare(
                                second.title,
                                undefined,
                                {
                                    sensitivity: "base",
                                }
                            );

                        case "name-desc":
                            return second.title.localeCompare(
                                first.title,
                                undefined,
                                {
                                    sensitivity: "base",
                                }
                            );

                        case "newest":
                        default:
                            return secondDate - firstDate;
                    }
                });
        }, [
            reviewUpdates,
            searchQuery,
            speciesFilter,
            reviewStatusFilter,
            sortOrder,
        ]);

    const statistics =
        useMemo(() => {
            return {
                pending:
                    reviewUpdates.filter(
                        (listing) => listing.reviewStatus === "pending"
                    ).length,

                rejected:
                    reviewUpdates.filter(
                        (listing) => listing.reviewStatus === "rejected"
                    ).length,

                approved:
                    reviewUpdates.filter(
                        (listing) =>
                            listing.reviewStatus ===
                            "approved"
                    ).length,
            };
        }, [
            reviewUpdates,
        ]);

    return {
        organisationProfile,
        isLoadingProfile,
        profileError,

        updates: reviewUpdates,
        filteredUpdates,

        isLoadingUpdates:
            isLoadingReviewUpdates,

        updatesError:
            reviewUpdatesError,

        statistics,
        refreshReviewUpdates,

        searchQuery,
        setSearchQuery,

        speciesFilter,
        setSpeciesFilter,

        reviewStatusFilter,
        setReviewStatusFilter,

        sortOrder,
        setSortOrder,
    };
}
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useOrganisationProfile } from "../context/OrganisationProfileContext";
import { useOrganisationListings } from "../context/OrganisationListingsContext";

import { getListingStatistics } from "../utils/listings/getListingStatistics";
import { useBackButtonRedirect } from "./useBackButtonRedirect";

import { routes } from "../constants/routes";

export function useDashboard() {
    useBackButtonRedirect(
        routes.home.dashboard
    );

    const navigate = useNavigate();

    //get profile
    const {
        organisationProfile,
        isLoadingProfile,
        profileError,
    } = useOrganisationProfile();

    //get listings
    const {
        listings,
        loadListings,
    } = useOrganisationListings();

    useEffect(() => {
        document.title =
            "Shelter Dashboard | PetPath";
    }, []);

    //load listings for approved accounts
    useEffect(() => {
        if (
            organisationProfile?.accountStatus ===
            "approved"
        ) {
            loadListings();
        }
    }, [
        organisationProfile?.accountStatus,
        loadListings,
    ]);


    //redirect if no user found
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
    }, [
        organisationProfile,
        navigate,
    ]);

    //calculate stats
    const listingStatistics = useMemo( //useMemo only recalculates when the listings change
        () =>
            getListingStatistics(
                listings
            ),
        [listings]
    );

    //checks if profile is setup
    const needsProfileSetup = organisationProfile?.profileComplete !== true;

    function goToProfileSetup() {
        navigate(
            routes.home.profileSetup
        );
    }

    return {
        organisationProfile,
        isLoadingProfile,
        profileError,
        listingStatistics,
        needsProfileSetup,
        goToProfileSetup,
    };
}
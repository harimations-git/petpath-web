import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    useOrganisationProfile,
} from "../context/OrganisationProfileContext";

import { routes } from "../constants/routes";

export function useApprovedOrganisationRoute(
    documentTitle: string
) {
    const navigate = useNavigate();

    const {
        organisationProfile,
        isLoadingProfile,
        profileError,
    } = useOrganisationProfile();

    useEffect(() => {
        document.title = documentTitle;
    }, [documentTitle]);

    /**
     * checks whether the organisation is allowed to stay on the 
     * current page
     */
    useEffect(() => {
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

        if (organisationProfile.accountStatus !== "approved") {
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

    //the hook returns the profile information to the component.
    return {
        organisationProfile,
        isLoadingProfile,
        profileError,
    };
}
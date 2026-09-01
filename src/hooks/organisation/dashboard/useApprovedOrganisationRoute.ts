import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganisationProfile } from "../../../context/OrganisationProfileContext";
import { routes } from "../../../constants/routes";

/**
 * Protects organisation routes that should only be accessible
 * to organisations with an approved account.
 */
export function useApprovedOrganisationRoute(documentTitle: string) {
    const navigate = useNavigate();

    const {
        organisationProfile,
        isLoadingProfile,
        profileError,
    } = useOrganisationProfile();

    useEffect(() => {
        document.title = documentTitle;
    }, [documentTitle]);

    //Redirect organisations that are not approved
    useEffect(() => {
        if (!organisationProfile) {
            return;
        }

        if (organisationProfile.accountStatus === "pending") {
            navigate(routes.auth.accountReview, {replace: true});

            return;
        }

        if (organisationProfile.accountStatus !== "approved") {
            navigate( routes.auth.login, {replace: true});
        }
    }, [
        organisationProfile,
        navigate,
    ]);

    //Return the profile state for the page to use
    return {
        organisationProfile,
        isLoadingProfile,
        profileError,
    };
}
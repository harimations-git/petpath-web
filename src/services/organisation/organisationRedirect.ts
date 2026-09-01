import { routes } from "../../constants/routes";
import type { OrganisationProfile } from "./organisationService";

/**
 * Returns the correct portal route for an organisation
 * based on its account status and profile completion.
 */
export function getRouteForOrganisation(profile: OrganisationProfile) {
  switch (profile.accountStatus) {
    case "pending":
      return routes.auth.accountReview;

    case "approved":
      return profile.profileComplete
        ? routes.home.dashboard
        : routes.home.profileSetup;

    case "rejected":
    case "suspended":
    default:
      return routes.auth.login;
  }
}
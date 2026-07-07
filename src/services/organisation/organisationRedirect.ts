import { routes } from "../../constants/routes";

import type {
  OrganisationProfile,
} from "./organisationService";

export function getRouteForOrganisation(
  profile: OrganisationProfile
) {
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
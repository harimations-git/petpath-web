import { routes } from "../../constants/routes";
import type { OrganisationStatus } from "./organisationService";

export function getRouteForOrganisationStatus(status: OrganisationStatus) {
  switch (status) {
    case "pending":
      return routes.auth.accountReview;

    case "approved":
      return routes.home.dashboard;

    case "rejected":
      return routes.auth.login;

    case "suspended":
      return routes.auth.login;

    default:
      return routes.auth.login;
  }
}
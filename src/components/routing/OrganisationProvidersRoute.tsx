import { Outlet } from "react-router-dom";
import { OrganisationProfileProvider } from "../../context/OrganisationProfileContext";
import { OrganisationListingsProvider } from "../../context/OrganisationListingsContext";

/**
 * Provides organisation profile and listing data to the organisation portal routes.
 */
export default function OrganisationProvidersRoute() {
    return (
        <OrganisationProfileProvider>
            <OrganisationListingsProvider>
                {/* Render the current child organisation route */}
                <Outlet />
            </OrganisationListingsProvider>
        </OrganisationProfileProvider>
    );
}
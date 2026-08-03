import { Outlet } from "react-router-dom";
import { OrganisationProfileProvider } from "../../context/OrganisationProfileContext";
import { OrganisationListingsProvider } from "../../context/OrganisationListingsContext";

export default function OrganisationProvidersRoute() {
    return (
        <OrganisationProfileProvider>
            <OrganisationListingsProvider>
                <Outlet />
            </OrganisationListingsProvider>
        </OrganisationProfileProvider>
    );
}
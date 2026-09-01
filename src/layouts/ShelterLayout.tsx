import { Outlet } from "react-router-dom";
import ShelterSidebar from "../components/ui/navigation/ShelterSidebar";
import {OrganisationProfileProvider} from "../context/OrganisationProfileContext";
import "./Layout.css";

/**
 * Shared layout used by organisation portal pages.
 * Provides organisation profile data and displays the shelter sidebar.
 */
export default function ShelterLayout() {
    return (
        <OrganisationProfileProvider>
            <div className="shelter-layout">
                <ShelterSidebar />

                <main className="shelter-layout-content">
                    {/* Outlet renders the child routes "Render the matched child route here"*/}
                    <Outlet />
                </main>
            </div>
        </OrganisationProfileProvider>
    );
}
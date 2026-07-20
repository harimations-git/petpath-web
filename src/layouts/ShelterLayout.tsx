import { Outlet } from "react-router-dom"; //outlet is where the shelter page will be displayed

import ShelterSidebar from "../components/ui/navigation/ShelterSidebar";

import {
    OrganisationProfileProvider,
} from "../context/OrganisationProfileContext";

import "./ShelterLayout.css";

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
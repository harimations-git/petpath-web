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
                    <Outlet />
                </main>
            </div>
        </OrganisationProfileProvider>
    );
}
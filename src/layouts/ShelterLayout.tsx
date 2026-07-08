import { Outlet } from "react-router-dom"; //outlet is where the shelter page will be displayed

import ShelterSidebar from "../components/ui/navigation/ShelterSidebar";

import "./ShelterLayout.css";

export default function ShelterLayout() {
    return (
        <div className="shelter-layout">
            <ShelterSidebar />

            <main className="shelter-layout-content">
                <Outlet />
            </main>
        </div>
    );
}
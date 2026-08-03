import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/ui/navigation/AdminSidebar";

import "./Layout.css";

export default function AdminLayout() {
    return (
        <div className="shelter-layout">
            <AdminSidebar />

            <main className="shelter-layout-content">
                <Outlet />
            </main>
        </div>
    );
}
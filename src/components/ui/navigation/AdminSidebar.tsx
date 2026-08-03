import {
    Building2,
    ClipboardCheck,
    LayoutDashboard,
} from "lucide-react";

import { routes } from "../../../constants/routes";

import PortalSidebar, { type SidebarItem } from "./PortalSidebar";

const adminSidebarItems: SidebarItem[] = [
    {
        label: "Dashboard",
        route: routes.admin.dashboard,
        icon: <LayoutDashboard size={20}/>,
    },
    {
        label: "Organisations",
        route: routes.admin.organisations,
        icon: <Building2 size={20}/>,
    },
    {
        label: "Listings",
        route: routes.admin.listings,
        icon: <ClipboardCheck size={20}/>,
    },
];

export default function AdminSidebar() {
    return (
        <PortalSidebar
            items={adminSidebarItems}
            dashboardRoute={routes.admin.dashboard}
        />
    );
}
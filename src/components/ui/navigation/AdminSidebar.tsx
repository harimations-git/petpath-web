import {
    Building2,
    ClipboardCheck,
    LayoutDashboard,
    PawPrint,
    WatchIcon,
} from "lucide-react";

import { routes } from "../../../constants/routes";

import PortalSidebar, { type SidebarItem } from "./PortalSidebar";

const adminSidebarItems: SidebarItem[] = [
    {
        label: "Dashboard",
        route: routes.admin.dashboard,
        icon: <LayoutDashboard size={20} />,
    },
    {
        label: "Organisations",
        route: routes.admin.organisations.allOrganisations,
        icon: <Building2 size={20} />,
    },
    {
        label: "Listings",
        route: routes.admin.listings.allListings,
        icon: <PawPrint size={20} />,
        hasDivider: true
    },
    {
        label: "Pending Organisations",
        route: routes.admin.organisations.pendingOrganisations,
        icon: <WatchIcon size={20} />,
    },
    {
        label: "Pending Listings",
        route: routes.admin.listings.pendingListings,
        icon: <ClipboardCheck size={20} />,
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
import {
    Bell,
    HelpCircleIcon,
    Home,
    List,
    PawPrint,
    Settings,
} from "lucide-react";

import {routes} from "../../../constants/routes";

import PortalSidebar, {type SidebarItem }from "./PortalSidebar";

const shelterSidebarItems: SidebarItem[] = [
    {
        label: "Dashboard",
        route: routes.home.dashboard,
        icon: <Home size={20} />,
    },
    {
        label: "My Listings",
        route: routes.home.myListings,
        icon: <List size={20} />,
    },
    {
        label: "Create Listing",
        route: routes.home.createListing,
        icon: <PawPrint size={20} />,
    },
    {
        label: "Status Updates",
        route: routes.home.status,
        icon: <Bell size={20} />,
        hasDivider: true,
    },
    {
        label: "Settings",
        route: routes.home.settings,
        icon: <Settings size={20} />,
    },
    {
        label: "Help Centre",
        route: routes.help.support,
        icon: <HelpCircleIcon size={20} />,
    },
];

export default function ShelterSidebar() {
    return (
        <PortalSidebar
            items={shelterSidebarItems}
            dashboardRoute={
                routes.home.dashboard
            }
        />
    );
}
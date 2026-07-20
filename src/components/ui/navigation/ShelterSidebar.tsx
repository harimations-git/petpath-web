import { useState, type ReactNode } from "react";

import {
    Bell,
    HelpCircleIcon,
    Home,
    List,
    Menu,
    PawPrint,
    Settings,
    X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { routes } from "../../../constants/routes";

import Logo from "../Logo";
import DecorativeLeaf from "../DecorativeLeaf";

import "./ShelterSidebar.css";

type SidebarItem = {
    label: string;
    route: string;
    icon: ReactNode;
};

const sidebarItems: SidebarItem[] = [
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <aside
            className={`shelter-sidebar ${isMenuOpen ? "shelter-sidebar-open" : ""
                }`}
        >
            <div className="shelter-sidebar-decoration">
                <DecorativeLeaf
                    bottom={-40}
                    left={-55}
                    rotate={-35}
                    width={230}
                    height={230}
                    flipX
                    opacity={0.65}
                />

                <DecorativeLeaf
                    bottom={100}
                    right={-30}
                    rotate={-20}
                    width={140}
                    height={140}
                    opacity={0.7}
                />
            </div>

            <div className="shelter-sidebar-mobile-header">
                <div className="shelter-sidebar-logo">
                    <Logo hasTagline size="sm" />
                </div>

                <button
                    type="button"
                    className="shelter-sidebar-menu-button"
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    {isMenuOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
                    )}
                </button>
            </div>

            <nav
                id="shelter-navigation"
                className="shelter-sidebar-navigation"
            >
                {sidebarItems.map((item) => (
                    <NavLink
                        key={item.route}
                        to={item.route}
                        end={item.route === routes.home.dashboard}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            [
                                "shelter-sidebar-link",
                                isActive ? "shelter-sidebar-link-active" : "",
                                item.label === "Status Updates"
                                    ? "shelter-sidebar-link-divider"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")
                        }
                    >
                        <span className="shelter-sidebar-icon">
                            {item.icon}
                        </span>

                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
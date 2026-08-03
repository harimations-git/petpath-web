import {
    useState,
    type ReactNode,
} from "react";

import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../decorative/Logo";
import DecorativeLeaf from "../decorative/DecorativeLeaf";
import "./ShelterSidebar.css";

export type SidebarItem = {
    label: string;
    route: string;
    icon: ReactNode;

    //adds a divider above this item
    hasDivider?: boolean;
};

type PortalSidebarProps = {
    items: SidebarItem[];
    dashboardRoute: string;
};

export default function PortalSidebar({
    items,
    dashboardRoute,
}: PortalSidebarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <aside
            className={[
                "shelter-sidebar",
                isMenuOpen
                    ? "shelter-sidebar-open"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
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
                    <Logo
                        hasTagline
                        size="sm"
                    />
                </div>

                <button
                    type="button"
                    className="shelter-sidebar-menu-button"
                    onClick={() =>
                        setIsMenuOpen(
                            (current) =>
                                !current
                        )
                    }
                >
                    {isMenuOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
                    )}
                </button>
            </div>

            <nav
                className="shelter-sidebar-navigation"
            >
                {items.map((item) => (
                    <NavLink
                        key={item.route}
                        to={item.route}
                        end={item.route === dashboardRoute}
                        onClick={closeMenu}
                        className={({isActive}) => ["shelter-sidebar-link",

                                isActive
                                    ? "shelter-sidebar-link-active"
                                    : "",

                                item.hasDivider
                                    ? "shelter-sidebar-link-divider"
                                    : "",
                            ].filter(Boolean).join(" ")
                        }
                    >
                        <span className="shelter-sidebar-icon">
                            {item.icon}
                        </span>

                        <span>
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
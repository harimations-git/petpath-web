import {
    List,
    Plus,
    type LucideIcon,
} from "lucide-react";

import { Link, type To} from "react-router-dom";

import { routes } from "../../../constants/routes";

type DashboardQuickActionsProps = {
    disabled?: boolean;
};

type QuickAction = {
    label: string;
    to: To;
    icon: LucideIcon;
};

//!!! lowkey this whole things is uglyyy so will change
export default function DashboardQuickActions({
    disabled = false,
}: DashboardQuickActionsProps) {
    const actions: QuickAction[] = [
        {
            label: "Create new listing",
            to: routes.home.createListing,
            icon: Plus,
        },
        {
            label: "View all listings",
            to: routes.home.myListings,
            icon: List,
        },
    ];

    return (
        <article className="dashboard-quick-actions">
            <h2>Quick actions</h2>

            <div className="dashboard-quick-actions-links">
                {actions.map(
                    ({
                        label,
                        to,
                        icon: Icon,
                    }) => (
                        <Link
                            key={label}
                            to={to}
                            onClick={(event) => {
                                if (disabled) {
                                    event.preventDefault();
                                }
                            }}
                        >
                            <span className="dashboard-action-icon">
                                <Icon size={27} />
                            </span>

                            <strong>{label}</strong>
                        </Link>
                    )
                )}
            </div>
        </article>
    );
}
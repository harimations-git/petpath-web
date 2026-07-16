import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import "./NavigationButton.css";

type NavigationButtonProps = {
    label: string;
    to: string;
    icon?: ReactNode;
    className?: string;
};

export default function NavigationButton({
    label,
    to,
    icon,
    className = "",
}: NavigationButtonProps) {
    return (
        <Link
            to={to}
            className={`navigation-button ${className}`}
        >
            {icon && (
                <span
                    className="navigation-button-icon"
                >
                    {icon}
                </span>
            )}

            <span>{label}</span>
        </Link>
    );
}
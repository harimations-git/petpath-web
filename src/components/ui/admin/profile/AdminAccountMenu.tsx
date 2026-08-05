import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    ChevronDown,
    LogOut,
    ShieldCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";


import "./AdminAccountMenu.css";
import { clearAdminDashboardCache } from "../../../../services/admin/adminDashboardService";
import { routes } from "../../../../constants/routes";

export default function AdminAccountMenu() {
    const navigate = useNavigate();

    const menuRef = useRef<HTMLDivElement | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    /*
     * Close the menu when the admin
     * clicks anywhere outside it.
     */
    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    async function handleLogout() {
        try {
            await signOut();

            //remove any cached admin data
            clearAdminDashboardCache();

            navigate(
                routes.auth.login,
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(
                "Unable to log out:",
                error
            );
        }
    }

    return (
        <div
            className="admin-account-menu"
            ref={menuRef}
        >
            <button
                type="button"
                className="admin-account-trigger"
                aria-expanded={isMenuOpen}
                aria-controls="admin-account-dropdown"
                onClick={() =>
                    setIsMenuOpen((current) => !current)
                }
            >
                <div className="admin-account-icon">
                    <ShieldCheck
                        size={21}
                    />
                </div>

                <div className="admin-account-details">
                    <strong>
                        Administrator
                    </strong>

                    <span>
                        Admin account
                    </span>
                </div>

                <ChevronDown
                    size={18}
                    className={[
                        "admin-account-chevron",
                        isMenuOpen ? "admin-account-chevron-open": "",
                    ].filter(Boolean).join(" ")}
                />
            </button>

            {isMenuOpen && (
                <div
                    id="admin-account-dropdown"
                    className="admin-account-dropdown"
                    role="menu"
                >
                    <button
                        type="button"
                        role="menuitem"
                        className="admin-account-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />

                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}
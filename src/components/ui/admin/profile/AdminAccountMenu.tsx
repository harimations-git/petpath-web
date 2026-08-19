import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    ChevronDown,
    Download,
    LogOut,
    ShieldCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";

import "./AdminAccountMenu.css";
import { clearAdminDashboardCache } from "../../../../services/admin/adminDashboardService";
import { routes } from "../../../../constants/routes";
import { exportAdminAuditLogs } from "../../../../services/admin/adminAuditLogService";

export default function AdminAccountMenu() {
    const navigate = useNavigate();

    const menuRef = useRef<HTMLDivElement | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExporting, setIsExporting,] = useState(false);

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

    //request and download all admin audit logs
    async function handleExportAuditLogs() {
        if (isExporting) {
            return;
        }


        try {
            setIsExporting(true);

            await exportAdminAuditLogs();

            setIsMenuOpen(false);

        } catch (error) {
            console.error(
                "Unable to export audit logs:",
                error
            );

        } finally {
            setIsExporting(false);
        }
    }

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
                        isMenuOpen ? "admin-account-chevron-open" : "",
                    ].filter(Boolean).join(" ")}
                />
            </button>

            {isMenuOpen && (
                <div
                    className="admin-account-dropdown"
                >
                    <button
                        type="button"
                        className="admin-account-export"
                        disabled={isExporting}
                        onClick={handleExportAuditLogs}
                    >
                        <Download size={17} />
                        
                        {isExporting ? "Exporting..." : "Export audit logs"}
                    </button>

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
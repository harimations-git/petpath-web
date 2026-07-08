import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { getCurrentOrganisationProfile, type OrganisationProfile } from "../../../services/organisation/organisationService";
import { routes } from "../../../constants/routes";

import "./OrganisationAccountMenu.css";

export default function OrganisationAccountMenu() {
    const navigate = useNavigate();

    const menuRef = useRef<HTMLDivElement | null>(null);
    const [profile, setProfile] = useState<OrganisationProfile | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadProfile() {
            try {
                const organisationProfile = await getCurrentOrganisationProfile();

                if (!isMounted) return;

                setProfile(organisationProfile);
            } catch (error) {
                console.error("Unable to load account menu profile");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        function handleOutsideClick(
            event: MouseEvent
        ) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, []);

    async function handleLogout() {
        try {
            await signOut();

            navigate(routes.auth.login, { replace: true });
        } catch (error) {
            console.error("Unable to log out: ", error);
        }
    }

    if (isLoading) {
        return (
            <div className="organisation-account-loading">
                <div className="organisation-account-loading-image" />

                <div>
                    <div className="organisation-account-loading-name" />
                    <div className="organisation-account-loading-type" />
                </div>
            </div>
        );
    }

    const organisationName = profile?.charityName || "Account details"

    const shouldShowImage = Boolean(profile?.profileImageUrl) && !imageFailed;

    return (
        <div
            className="organisation-account-menu"
            ref={menuRef}
        >
            <button
                type="button"
                className="organisation-account-trigger"
                onClick={() =>
                    setIsMenuOpen((current) => !current)
                }
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
            >
                <div className="organisation-account-avatar">
                    {shouldShowImage && (
                        <img
                            src={profile?.profileImageUrl}
                            alt={`${organisationName} profile`}
                            onError={() =>
                                setImageFailed(true)
                            }
                        />
                    )}
                </div>

                <div className="organisation-account-details">
                    <strong>
                        {organisationName}
                    </strong>

                    <span>
                        Shelter account
                    </span>
                </div>

                <ChevronDown
                    className={`organisation-account-chevron ${isMenuOpen
                        ? "organisation-account-chevron-open"
                        : ""
                        }`}
                    size={18}
                />
            </button>

            {isMenuOpen && (
                <div
                    className="organisation-account-dropdown"
                    role="menu"
                >
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setIsMenuOpen(false);
                            navigate(
                                routes.home.settings
                            );
                        }}
                    >
                        <Settings size={17} />
                        Account settings
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        className="organisation-account-logout"
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

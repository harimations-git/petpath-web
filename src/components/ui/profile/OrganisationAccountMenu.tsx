import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ChevronDown,
    LogOut,
    Settings,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";

import { routes } from "../../../constants/routes";

import {
    useOrganisationProfile,
} from "../../../context/OrganisationProfileContext";

import "./OrganisationAccountMenu.css";
import { useOrganisationListings } from "../../../context/OrganisationListingsContext";

export default function OrganisationAccountMenu() {
    const navigate = useNavigate();

    const {
        organisationProfile: profile,
        isLoadingProfile: isLoading,
        clearCachedOrganisationProfile,
    } = useOrganisationProfile();

    const { clearCachedListings, clearCachedReviewUpdates } = useOrganisationListings();

    const menuRef =
        useRef<HTMLDivElement | null>(null);

    const [isMenuOpen, setIsMenuOpen] =
        useState(false);

    const [imageFailed, setImageFailed] =
        useState(false);

    /*
     * Reset the image error state whenever the profile image URL changes.
     */
    useEffect(() => {
        setImageFailed(false);
    }, [profile?.profileImageUrl]);

    /*
     * Close the account dropdown when the user clicks
     * anywhere outside the account menu.
     */
    useEffect(() => {
        function handleOutsideClick(
            event: MouseEvent
        ) {
            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    /*
     * Creates initials to display when the profile image
     * is unavailable or fails to load.
     */
    function getInitials(name: string) {
        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 0) {
            return "PP";
        }

        if (words.length === 1) {
            return words[0]
                .slice(0, 2)
                .toUpperCase();
        }

        return `${words[0][0]}${words[1][0]}`
            .toUpperCase();
    }

    async function handleLogout() {
        try {
            await signOut();

            //clear profile cache
            clearCachedOrganisationProfile();
            clearCachedListings();
            clearCachedReviewUpdates();

            navigate(routes.auth.login, {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Unable to log out:",
                error
            );
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

    const organisationName =
        profile?.charityName || "Account details";

    const shouldShowImage =
        Boolean(profile?.profileImageUrl) &&
        !imageFailed;

    return (
        <div
            className="organisation-account-menu"
            ref={menuRef}
        >
            <button
                type="button"
                className="organisation-account-trigger"
                onClick={() =>
                    setIsMenuOpen(
                        (current) => !current
                    )
                }
            >
                <div className="organisation-account-avatar">
                    {shouldShowImage ? (
                        <img
                            src={profile?.profileImageUrl}
                            alt={`${organisationName} profile`}
                            onError={() =>
                                setImageFailed(true)
                            }
                        />
                    ) : (
                        <span>
                            {getInitials(
                                organisationName
                            )}
                        </span>
                    )}
                </div>

                <div className="organisation-account-details">
                    <strong>
                        {organisationName}
                    </strong>

                    <span>Shelter account</span>
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
                    id="organisation-account-dropdown"
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
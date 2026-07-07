import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

import InfoModal from "../../components/ui/InfoModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import {
    getCurrentOrganisationProfile,
    type OrganisationProfile,
} from "../../services/organisation/organisationService";

import { routes } from "../../constants/routes";
import { useBackButtonRedirect } from "../../hooks/useBackButtonRedirect";

export default function Dashboard() {
    useBackButtonRedirect(routes.home.dashboard);
    const navigate = useNavigate();

    const [organisationProfile, setOrganisationProfile] =
        useState<OrganisationProfile | null>(null);

    const [isCheckingProfile, setIsCheckingProfile] =
        useState(true);

    const [profileError, setProfileError] =
        useState("");

    useEffect(() => {
        document.title = "Shelter Dashboard | PetPath";

        let isMounted = true;

        async function loadOrganisationProfile() {
            try {
                const profile =
                    await getCurrentOrganisationProfile();

                if (!isMounted) return;

                if (profile.accountStatus === "pending") {
                    navigate(routes.auth.accountReview, {
                        replace: true,
                    });

                    return;
                }

                if (profile.accountStatus !== "approved") {
                    navigate(routes.auth.login, {
                        replace: true,
                    });

                    return;
                }

                setOrganisationProfile(profile);
            } catch (error) {
                console.error(
                    "Unable to load organisation profile:",
                    error
                );

                if (!isMounted) return;

                setProfileError(
                    "We couldn't load your organisation profile."
                );
            } finally {
                if (isMounted) {
                    setIsCheckingProfile(false);
                }
            }
        }

        loadOrganisationProfile();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    if (isCheckingProfile) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading your shelter account..."
            />
        );
    }

    if (profileError) {
        return (
            <main className="dashboard-page">
                <p className="dashboard-error">
                    {profileError}
                </p>
            </main>
        );
    }

    const needsProfileSetup =
        organisationProfile?.profileComplete !== true;

    return (
        <main className="dashboard-page">
            <h1>Shelter Dashboard</h1>

            <p>
                Manage your PetPath listings.
            </p>

            <div className="dashboard-actions">
                <Link
                    to="/listings/new"
                    aria-disabled={needsProfileSetup}
                    onClick={(event) => {
                        if (needsProfileSetup) {
                            event.preventDefault();
                        }
                    }}
                >
                    Create pet listing
                </Link>

                <Link
                    to="/listings"
                    aria-disabled={needsProfileSetup}
                    onClick={(event) => {
                        if (needsProfileSetup) {
                            event.preventDefault();
                        }
                    }}
                >
                    View my listings
                </Link>
            </div>

            <InfoModal
                visible={needsProfileSetup}
                icon={Building2}
                title={`Welcome, ${organisationProfile?.charityName ??
                    "to PetPath"
                    }`}
                message="Before you can start listing pets, you must complete your profile setup. This helps adopters understand who you are and how to contact you."
                buttonText="Complete profile"
                closeOnBackdrop={false}
                onConfirm={() => {
                    navigate(routes.home.profileSetup);
                }}
            />
        </main>
    );
}
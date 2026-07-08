import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Heart, Home, List, PawPrint, Plus, ShieldCheck } from "lucide-react";

import InfoModal from "../../components/ui/InfoModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import "./Dashboard.css"

import {
    useOrganisationProfile,
} from "../../context/OrganisationProfileContext";

import { routes } from "../../constants/routes";
import { useBackButtonRedirect } from "../../hooks/useBackButtonRedirect";
import OrganisationAccountMenu from "../../components/ui/profile/OrganisationAccountMenu";

export default function Dashboard() {
    useBackButtonRedirect(routes.home.dashboard);
    const navigate = useNavigate();

    const { organisationProfile, isLoadingProfile, profileError } = useOrganisationProfile();

    useEffect(() => {
        document.title = "Shelter Dashboard | PetPath";

        if (!organisationProfile) {
            return;
        }

        if (organisationProfile.accountStatus === "pending") {
            navigate(routes.auth.accountReview, {
                replace: true,
            });

            return;
        }

        if (
            organisationProfile.accountStatus !== "approved"
        ) {
            navigate(routes.auth.login, {
                replace: true,
            });
        }
    }, [organisationProfile, navigate]);

    if (isLoadingProfile) {
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
            <header className="dashboard-header">
                <div className="dashboard-heading">
                    <h1>Shelter Dashboard</h1>
                    <p>Manage your PetPath listings.</p>
                </div>

                <div className="dashboard-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <section
                className="dashboard-statistics"
            >
                <article className="dashboard-stat-card">
                    <span className="dashboard-stat-icon">
                        <Home size={22} />
                    </span>

                    <div>
                        <span>Active listings</span>
                        <strong>24</strong> {/*Will get the users real stats!!*/}
                    </div>
                </article>

                <article className="dashboard-stat-card">
                    <span className="dashboard-stat-icon">
                        <ShieldCheck size={22} />
                    </span>

                    <div>
                        <span>Pending review</span>
                        <strong>6</strong> {/*Will get the users real stats!!*/}
                    </div>
                </article>

                <article className="dashboard-stat-card">
                    <span className="dashboard-stat-icon">
                        <Heart size={22} /> {/*Will get the users real stats!!*/}
                    </span>

                    <div>
                        <span>Reserved pets</span>
                        <strong>5</strong> {/*Will get the users real stats!!*/}
                    </div>
                </article>

                <article className="dashboard-stat-card">
                    <span className="dashboard-stat-icon">
                        <PawPrint size={22} />
                    </span>

                    <div>
                        <span>Re-homed this month</span>
                        <strong>8</strong> {/*Will get the users real stats!!*/}
                    </div>
                </article>
            </section>

            <section className="dashboard-content-grid">
                <article className="dashboard-summary-card">
                    <h2>Listing status summary</h2>

                    <div
                        className="dashboard-pie-chart"
                        role="img"
                    />

                    <div className="dashboard-chart-legend">
                        <span>
                            <i className="dashboard-legend-active" />
                            Active
                        </span>

                        <span>
                            <i className="dashboard-legend-pending" />
                            Pending
                        </span>

                        <span>
                            <i className="dashboard-legend-reserved" />
                            Reserved
                        </span>
                    </div>
                </article>

                <article className="dashboard-quick-actions">
                    <h2>Quick actions</h2>

                    <div className="dashboard-quick-actions-links">
                        <Link
                            to={routes.home.createListing}
                            aria-disabled={needsProfileSetup}
                            onClick={(event) => {
                                if (needsProfileSetup) {
                                    event.preventDefault();
                                }
                            }}
                        >
                            <span className="dashboard-action-icon">
                                <Plus size={27} />
                            </span>

                            <strong>Create new listing</strong>
                        </Link>

                        <Link
                            to={routes.home.myListings}
                            aria-disabled={needsProfileSetup}
                            onClick={(event) => {
                                if (needsProfileSetup) {
                                    event.preventDefault();
                                }
                            }}
                        >
                            <span className="dashboard-action-icon">
                                <List size={27} />
                            </span>

                            <strong>View all listings</strong>
                        </Link>
                    </div>
                </article>
            </section>

            <img
                className="dashboard-corner-image"
                src="/images/Dashboard-Animals.png"
                alt=""
                aria-hidden="true"
            />

            <InfoModal
                visible={needsProfileSetup}
                icon={Building2}
                title={`Welcome, ${organisationProfile?.charityName ?? "to PetPath"
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
import {
    Building2,
} from "lucide-react";

import InfoModal from "../../components/ui/InfoModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import OrganisationAccountMenu from "../../components/ui/profile/OrganisationAccountMenu";

import DashboardStatistics from "../../components/ui/dashboard/ListingStatistics";
import DashboardQuickActions from "../../components/ui/dashboard/QuickActions";

import {
    useDashboard,
} from "../../hooks/useDashboard";

import "./Dashboard.css";
import "./PageHeading.css";

export default function Dashboard() {
    const {
        organisationProfile,
        isLoadingProfile,
        profileError,
        listingStatistics,
        needsProfileSetup,
        goToProfileSetup,
    } = useDashboard();

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

    return (
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>
                        Shelter Dashboard
                    </h1>

                    <p>
                        Manage your PetPath listings.
                    </p>
                </div>

                <div className="page-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <DashboardStatistics
                statistics={
                    listingStatistics
                }
            />

            <section className="dashboard-content-grid">
                <article className="dashboard-summary-card">
                    <h2>
                        Listing status summary
                    </h2>

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

                <DashboardQuickActions
                    disabled={
                        needsProfileSetup
                    }
                />
            </section>

            <InfoModal
                visible={
                    needsProfileSetup
                }
                icon={Building2}
                title={`Welcome, ${
                    organisationProfile?.charityName ??
                    "to PetPath"
                }`}
                message="Before you can start listing pets, you must complete your profile setup. This helps adopters understand who you are and how to contact you."
                buttonText="Complete profile"
                closeOnBackdrop={false}
                onConfirm={
                    goToProfileSetup
                }
            />
        </main>
    );
}
import {
    ArrowRight,
    Building2,
    ClipboardCheck,
    Clock3,
    HeartHandshake,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import InfoModal from "../../components/ui/InfoModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import OrganisationAccountMenu from "../../components/ui/profile/OrganisationAccountMenu";

import DashboardStatistics from "../../components/ui/dashboard/ListingStatistics";
import DashboardQuickActions from "../../components/ui/dashboard/QuickActions";

import {
    useDashboard,
} from "../../hooks/dashboard/useDashboard";

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
                    <h1>Shelter Dashboard</h1>

                    <p>
                        A quick overview of your listings, account status and
                        next steps.
                    </p>
                </div>

                <div className="page-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <section className="dashboard-hero">
                <div className="dashboard-hero-content">
                    <span className="dashboard-eyebrow">
                        <Sparkles size={16} />
                        Shelter workspace
                    </span>

                    <h2>
                        Welcome back,{" "}
                        {organisationProfile?.charityName ??
                            "your shelter"}
                    </h2>

                    <p>
                        Manage your PetPath listings, keep pet information up to
                        date and make sure adopters see accurate, trustworthy
                        details.
                    </p>

                    {needsProfileSetup ? (
                        <button
                            type="button"
                            className="dashboard-hero-button"
                            onClick={goToProfileSetup}
                        >
                            Complete profile
                            <ArrowRight size={18} />
                        </button>
                    ) : (
                        <div className="dashboard-hero-status">
                            <ShieldCheck size={18} />

                            <span>
                                Your shelter profile is ready for listing pets.
                            </span>
                        </div>
                    )}
                </div>
            </section>

            <DashboardStatistics
                statistics={listingStatistics}
            />

            <section className="dashboard-main-grid">
                <article className="dashboard-attention-card">
                    <div className="dashboard-section-heading">
                        <div>
                            <h2>Needs attention</h2>

                            <p>
                                The most important things to check today.
                            </p>
                        </div>

                        <ClipboardCheck size={24} />
                    </div>

                    <div className="dashboard-attention-list">
                        {needsProfileSetup && (
                            <button
                                type="button"
                                className="dashboard-attention-item dashboard-attention-warning"
                                onClick={goToProfileSetup}
                            >
                                <Building2 size={20} />

                                <span>
                                    <strong>
                                        Complete your shelter profile
                                    </strong>

                                    <small>
                                        Add your organisation details so
                                        adopters know who they are contacting.
                                    </small>
                                </span>

                                <ArrowRight size={17} />
                            </button>
                        )}

                        <div className="dashboard-attention-item">
                            <Clock3 size={20} />

                            <span>
                                <strong>
                                    {listingStatistics.pendingReview} pending
                                    review
                                </strong>

                                <small>
                                    Listings submitted for review will appear
                                    here while they are waiting.
                                </small>
                            </span>
                        </div>

                        <div className="dashboard-attention-item">
                            <HeartHandshake size={20} />

                            <span>
                                <strong>
                                    {listingStatistics.reservedPets} reserved
                                    pets
                                </strong>

                                <small>
                                    Keep reserved listings updated so adopters
                                    see accurate availability.
                                </small>
                            </span>
                        </div>

                        {!needsProfileSetup &&
                            listingStatistics.pendingReview === 0 &&
                            listingStatistics.reservedPets === 0 && (
                                <div className="dashboard-empty-attention">
                                    <ShieldCheck size={22} />

                                    <span>
                                        Everything looks up to date.
                                    </span>
                                </div>
                            )}
                    </div>
                </article>

                <DashboardQuickActions
                    disabled={needsProfileSetup}
                />
            </section>

            <InfoModal
                visible={needsProfileSetup}
                icon={Building2}
                title={`Welcome, ${organisationProfile?.charityName ??
                    "to PetPath"
                    }`}
                message="Before you can start listing pets, you must complete your profile setup. This helps adopters understand who you are and how to contact you."
                buttonText="Complete profile"
                closeOnBackdrop={false}
                onConfirm={goToProfileSetup}
            />
        </main>
    );
}
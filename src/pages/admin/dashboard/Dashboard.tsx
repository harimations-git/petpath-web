import {
    Building2,
    ClipboardCheck,
    ShieldCheck,
} from "lucide-react";

import Card from "../../../components/ui/Card";
import AdminDashboardStatistics from "../../../components/ui/admin/dashboard/AdminDashboardStatistics";
import AdminReviewItem from "../../../components/ui/admin/dashboard/AdminReviewItem";
import AdminReviewSection from "../../../components/ui/admin/dashboard/AdminReviewSection";

import { useAdminDashboard } from "../../../hooks/admin/useAdminDashboard";

import { routes } from "../../../constants/routes";

import "./Dashboard.css";
import "../../organisation/dashboard/PageHeading.css";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CustomButton from "../../../components/ui/CustomButton";
import { formatDate, formatDisplayValue, formatOldestWaiting } from "../../../utils/listings/displayFormatting";
import AdminAccountMenu from "../../../components/ui/admin/profile/AdminAccountMenu";

export default function AdminDashboard() {

    const {
        dashboard,
        isLoading,
        error,
        refreshDashboard,
    } = useAdminDashboard();

    if (isLoading) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading pending reviews..."
            />
        );
    }

    if (error || !dashboard) {
        return (
            <main className="page-body">
                <Card className="admin-dashboard-error">
                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error || "The dashboard information could not be loaded."}
                    </p>

                    <CustomButton
                        label="Try again"
                        onClick={refreshDashboard}
                    />
                </Card>
            </main>
        );
    }

    const {
        pendingOrganisations,
        pendingListings,
        statistics,
    } = dashboard;

    return (
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>Admin Dashboard</h1>

                    <p>
                        Review organisation applications and pet listings
                        awaiting approval.
                    </p>
                </div>
                <div className="page-account-menu">
                    <AdminAccountMenu />
                </div>
            </header>

            <Card className="admin-dashboard-hero">
                <div className="admin-dashboard-hero-icon">
                    <ShieldCheck size={27} />
                </div>

                <div className="admin-dashboard-hero-content">
                    <span className="admin-dashboard-eyebrow">
                        Admin workspace
                    </span>

                    <h2>
                        Keep PetPath safe and trustworthy
                    </h2>

                    <p>
                        Review organisation details and submitted pet listings
                        before they become visible to PetPath users.
                    </p>
                </div>
            </Card>

            <AdminDashboardStatistics
                pendingOrganisationCount={statistics.pendingOrganisationCount}
                pendingListingCount={statistics.pendingListingCount}
                oldestWaitingLabel={formatOldestWaiting(statistics.oldestWaitingAt)}
            />

            <section className="admin-review-grid">
                <AdminReviewSection
                    icon={Building2}
                    title="Organisation applications"
                    description="Pending applications submitted during the last seven days."
                    itemsLabel="Pending organisation applications"
                    isEmpty={pendingOrganisations.length === 0}
                    emptyMessage="There are no organisation applications awaiting review."
                    viewAllRoute={routes.admin.organisations}
                    viewAllLabel="View all pending organisations"
                >
                    {pendingOrganisations.map(
                        (organisation) => (
                            <AdminReviewItem
                                key={organisation.organisationId}
                                icon={Building2}
                                title={organisation.charityName}
                                details={[
                                    {
                                        label: "Charity ID",
                                        value: organisation.charityId,
                                    },
                                    {
                                        label: "Email",
                                        value: organisation.email,
                                    },
                                ]}
                                submittedAt={formatDate(organisation.submittedAt)}
                            />
                        )
                    )}
                </AdminReviewSection>

                <AdminReviewSection
                    icon={ClipboardCheck}
                    title="Pet listings"
                    description="Pending listings submitted during the last seven days."
                    itemsLabel="Pending pet listings"
                    isEmpty={pendingListings.length === 0}
                    emptyMessage="There are no pet listings awaiting review."
                    viewAllRoute={routes.admin.listings}
                    viewAllLabel="View all pending listings"
                >
                    {pendingListings.map(
                        (listing) => (
                            <AdminReviewItem
                                key={listing.listingId}
                                icon={ClipboardCheck}
                                title={listing.title}
                                subtitle={
                                    listing.organisationName
                                }
                                details={[
                                    {
                                        label:
                                            "Listing",

                                        value:
                                            `${formatDisplayValue(listing.animalType)} · ${formatDisplayValue(listing.listingType)}`,
                                    },
                                    {
                                        label: "Documents",

                                        value:
                                            listing.documentCount ===
                                                1
                                                ? "1 uploaded"
                                                : `${listing.documentCount} uploaded`,
                                    },
                                ]}
                                submittedAt={formatDate(listing.submittedAt)}
                            />
                        )
                    )}
                </AdminReviewSection>
            </section>          
        </main>
    );
}
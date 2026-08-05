import {
    Building2,
    Clock3,
    Search,
    ShieldCheck,
} from "lucide-react";

import Card from "../../../components/ui/Card";
import AdminAccountMenu from "../../../components/ui/admin/profile/AdminAccountMenu";
import AdminOrganisationCard from "../../../components/ui/admin/organisations/OrganisationCard";

import { formatDate } from "../../../utils/listings/displayFormatting";

import "./OrganisationReview.css";
import { usePendingOrganisations } from "../../../hooks/admin/usePendingOrganisation";
import type { PendingOrganisation } from "../../../types/admin/adminOrganisation";

export default function OrganisationReview() {
    const {
        displayedOrganisations,

        pendingCount,
        oldestSubmittedAt,

        searchQuery,
        setSearchQuery,

        sortOrder,
        setSortOrder,

        isLoading,
        isLoadingMore,

        updatingOrganisationId,

        error,
        hasMore,

        loadMore,
        retry,

        approveOrganisation,
        rejectOrganisation,
    } = usePendingOrganisations();

    async function handleApproveOrganisation(
        organisation:PendingOrganisation
    ) {
        //will replace with info modal
        const confirmed = window.confirm(`Approve ${organisation.charityName}?`);

        if (!confirmed) {
            return;
        }

        await approveOrganisation(organisation.organisationId);
    }

    async function handleRejectOrganisation(
        organisation: PendingOrganisation
    ) {
        //will replace with info modal
        const confirmed = window.confirm(`Reject ${organisation.charityName}?`);

        if (!confirmed) {
            return;
        }

        await rejectOrganisation(organisation.organisationId);
    }

    return (
        <div className="page-body admin-organisations-page">
            <header className="page-header">
                <div className="page-heading">
                    <h1>
                        Pending Organisations
                    </h1>

                    <p>
                        Review organisation applications
                        before they can create and publish
                        pet listings.
                    </p>
                </div>

                <div className="page-account-menu">
                    <AdminAccountMenu />
                </div>
            </header>

            <section className="admin-organisations-statistics">
                <Card className="admin-organisations-controls">
                    <div className="admin-organisations-search">
                        <label htmlFor="organisation-search">
                            Search organisations
                        </label>

                        <div className="admin-organisations-search-input">
                            <Search size={18} />

                            <input
                                id="organisation-search"
                                type="search"
                                value={searchQuery}
                                placeholder="Search loaded organisations"
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="admin-organisations-sort">
                        <label htmlFor="organisation-sort">
                            Sort applications
                        </label>

                        <select
                            id="organisation-sort"
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value === "newest" ? "newest" : "oldest")}
                        >
                            <option value="oldest">
                                Oldest first
                            </option>

                            <option value="newest">
                                Newest first
                            </option>
                        </select>
                    </div>
                </Card>

                <Card className="admin-organisations-statistic-card">
                    <div className="admin-organisations-statistic-icon">
                        <Building2 size={22} />
                    </div>

                    <div className="admin-organisations-statistic-text">
                        <span>
                            Awaiting review
                        </span>

                        <strong>
                            {pendingCount}
                        </strong>
                    </div>
                </Card>

                <Card className="admin-organisations-statistic-card">
                    <div className="admin-organisations-statistic-icon">
                        <Clock3 size={22} />
                    </div>

                    <div className="admin-organisations-statistic-text">
                        <span>
                            Oldest application
                        </span>

                        <strong>
                            {oldestSubmittedAt ? formatDate(oldestSubmittedAt) : "None"}
                        </strong>
                    </div>
                </Card>
            </section>

            <section className="admin-organisations-results">
                <div className="admin-organisations-results-header">
                    <div>
                        <h2>
                            Pending applications
                        </h2>

                        <p>
                            {displayedOrganisations.length}{" "}
                            {displayedOrganisations.length === 1 ? "organisation" : "organisations"}{" "}
                            awating approval
                        </p>
                    </div>
                </div>

                {error && (
                    <Card className="admin-organisations-error">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() => void retry()}
                        >
                            Try again
                        </button>
                    </Card>
                )}

                {isLoading ? (
                    <Card className="admin-organisations-empty">
                        <p>Loading organisations... </p>
                    </Card>
                ) : displayedOrganisations.length > 0 ? (
                    <>
                        <div className="admin-organisations-list">
                            {displayedOrganisations.map(
                                (organisation) => (
                                    <div key={organisation.organisationId}>
                                        <AdminOrganisationCard
                                            organisation={organisation}
                                            isUpdating={updatingOrganisationId === organisation.organisationId}
                                            onApprove={handleApproveOrganisation}
                                            onReject={handleRejectOrganisation}
                                        />
                                    </div>
                                )
                            )}
                        </div>

                        {hasMore && (
                            <div className="admin-organisations-load-more">
                                <button
                                    type="button"
                                    disabled={isLoadingMore}
                                    onClick={() => void loadMore()}
                                >
                                    {isLoadingMore
                                        ? "Loading..."
                                        : "Load more"}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <Card className="admin-organisations-empty">
                        <ShieldCheck size={34} />

                        <strong>
                            No organisations found
                        </strong>

                        <p> No pending applications match your current search.</p>
                    </Card>
                )}
            </section>
        </div>
    );
}
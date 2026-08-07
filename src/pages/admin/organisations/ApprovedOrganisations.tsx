import { Building2, Clock3, Search, ShieldCheck } from "lucide-react";

import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import AdminAccountMenu from "../../../components/ui/admin/profile/AdminAccountMenu";
import ApprovedOrganisationCard from "../../../components/ui/admin/organisations/ApprovedOrganisationCard";
import { useApprovedOrganisations } from "../../../hooks/admin/useApprovedOrganisations";
import type { ApprovedOrganisation } from "../../../types/admin/adminOrganisation";
import { formatDate } from "../../../utils/listings/displayFormatting";
import { routes } from "../../../constants/routes";

import "./OrganisationPages.css";
import CardList from "../../../components/ui/CardList";

export default function ApprovedOrganisations() {
    const navigate = useNavigate();

    const {
        displayedOrganisations,

        approvedCount,
        latestApprovedAt,

        searchQuery,
        setSearchQuery,

        sortOrder,
        setSortOrder,

        isLoading,
        isLoadingMore,

        error,
        hasMore,

        loadMore,
        retry,
    } = useApprovedOrganisations();

    function handleViewOrganisation(organisation: ApprovedOrganisation) {
        navigate(routes.admin.organisations.details(organisation.organisationId));
    }

    return (
        <main className="page-body admin-organisations-page">
            <header className="page-header">
                <div className="page-heading">
                    <h1>
                        Approved Organisations
                    </h1>

                    <p>
                        View approved organisations
                        and manage their account
                        information.
                    </p>
                </div>

                <div className="page-account-menu">
                    <AdminAccountMenu />
                </div>
            </header>

            <section className="admin-organisations-statistics">
                <Card className="admin-organisations-controls">
                    <div className="admin-organisations-search">
                        <label htmlFor="approved-organisation-search">
                            Search organisations
                        </label>

                        <div className="admin-organisations-search-input">
                            <Search size={18} />

                            <input
                                id="approved-organisation-search"
                                type="search"
                                value={searchQuery}
                                placeholder="Search loaded organisations"
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="admin-organisations-sort">
                        <label htmlFor="approved-organisation-sort">
                            Sort organisations
                        </label>

                        <select
                            id="approved-organisation-sort"
                            value={sortOrder}
                            onChange={(event) =>
                                setSortOrder(event.target.value === "oldest"
                                    ? "oldest"
                                    : "newest"
                                )
                            }
                        >
                            <option value="newest">
                                Newest first
                            </option>

                            <option value="oldest">
                                Oldest first
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
                            Approved organisations
                        </span>

                        <strong>
                            {approvedCount}
                        </strong>
                    </div>
                </Card>

                <Card className="admin-organisations-statistic-card">
                    <div className="admin-organisations-statistic-icon">
                        <Clock3 size={22} />
                    </div>

                    <div className="admin-organisations-statistic-text">
                        <span>
                            Latest approval
                        </span>

                        <strong>
                            {latestApprovedAt ? formatDate(latestApprovedAt) : "None"}
                        </strong>
                    </div>
                </Card>
            </section>

            <section className="admin-organisations-results">
                <div className="admin-organisations-results-header">
                    <div>
                        <h2>
                            Approved organisations
                        </h2>

                        <p>
                            {displayedOrganisations.length}{" "}
                            {displayedOrganisations.length === 1
                                ? "organisation"
                                : "organisations"}
                            {" "} loaded
                        </p>
                    </div>
                </div>

                {error && (
                    <Card className="admin-organisations-error">
                        <p>
                            {error}
                        </p>

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
                        <LoadingSpinner size="large" />

                        <p>Loading organisations...</p>
                    </Card>
                ) : displayedOrganisations.length > 0 ? (
                    <CardList
                        hasMore={hasMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={() => void loadMore()}
                    >
                        {displayedOrganisations.map(
                            (organisation) => (
                                <ApprovedOrganisationCard
                                    key={organisation.organisationId}
                                    organisation={organisation}
                                    onView={handleViewOrganisation}
                                />
                            )
                        )}
                    </CardList>
                ) : (
                    <Card className="admin-organisations-empty">
                        <ShieldCheck
                            size={34}
                        />

                        <strong>
                            No organisations found
                        </strong>

                        <p>
                            No approved
                            organisations match your
                            current search.
                        </p>
                    </Card>
                )}
            </section>
        </main>
    );
}
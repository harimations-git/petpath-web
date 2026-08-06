import { Building2, Clock3, Eye, Mail, ShieldCheck } from "lucide-react";
import { formatDate } from "../../../../utils/listings/displayFormatting";
import type { ApprovedOrganisation } from "../../../../types/admin/adminOrganisation";

type ApprovedOrganisationCardProps = {
    organisation: ApprovedOrganisation;

    onView: (organisation: ApprovedOrganisation) => void;
};

export default function ApprovedOrganisationCard({
    organisation,
    onView,
}: ApprovedOrganisationCardProps) {
    const approvedAt = organisation.reviewedAt ?? organisation.updatedAt;

    return (
        <article className="admin-organisation-card">
            <div className="admin-organisation-card-main">
                <div className="admin-organisation-icon">
                    <Building2 size={22} />
                </div>

                <div className="admin-organisation-content">
                    <div className="admin-organisation-heading">
                        <div>
                            <span className="admin-organisation-status">
                                <ShieldCheck size={14}/>

                                Approved organisation
                            </span>

                            <h2>
                                {organisation.charityName}
                            </h2>
                        </div>
                    </div>

                    <dl className="admin-organisation-details">
                        <div>
                            <dt>
                                Charity ID
                            </dt>

                            <dd>
                                {organisation.charityId}
                            </dd>
                        </div>

                        <div>
                            <dt>
                                <Mail size={14} />
                                Email
                            </dt>

                            <dd>
                                {organisation.email}
                            </dd>
                        </div>

                        <div>
                            <dt>
                                <Clock3
                                    size={15}
                                />
                                Approved
                            </dt>

                            <dd>
                                {approvedAt ? formatDate(approvedAt) : "Not provided"}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="admin-organisation-actions">
                <button
                    type="button"
                    className="admin-organisation-action admin-organisation-view-button"
                    onClick={() => onView(organisation)}
                >
                    <Eye size={17} />

                    View details
                </button>
            </div>
        </article>
    );
}
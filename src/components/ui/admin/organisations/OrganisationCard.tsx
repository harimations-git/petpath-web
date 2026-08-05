import {
    Building2,
    Check,
    Clock3,
    Mail,
    ShieldCheck,
    X,
} from "lucide-react";

import type { PendingOrganisation } from "../../../../types/admin/adminDashboard";
import { formatDate } from "../../../../utils/listings/displayFormatting";

type AdminOrganisationCardProps = {
    organisation: PendingOrganisation;

    isUpdating?: boolean;

    onApprove: (organisation: PendingOrganisation) => void;
    onReject: (organisation: PendingOrganisation) => void;
};

export default function AdminOrganisationCard({
    organisation,
    isUpdating = false,
    onApprove,
    onReject,
}: AdminOrganisationCardProps) {
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
                                <ShieldCheck size={14} />

                                Pending review
                            </span>

                            <h2>
                                {organisation.charityName}
                            </h2>
                        </div>

                        <span className="admin-organisation-date">

                        </span>
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
                                <Clock3 size={15} />
                                Submitted

                            </dt>
                            <dd>
                                {formatDate(organisation.submittedAt)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="admin-organisation-actions">
                <button
                    type="button"
                    className="admin-organisation-action admin-organisation-reject-button"
                    disabled={isUpdating}
                    onClick={() =>
                        onReject(organisation)
                    }
                >
                    <X size={17} />

                    {isUpdating ? "Updating..." : "Reject"}
                </button>

                <button
                    type="button"
                    className="admin-organisation-action admin-organisation-approve-button"
                    disabled={isUpdating}
                    onClick={() => onApprove(organisation)}
                >
                    <Check size={17} />

                    {isUpdating ? "Updating..." : "Approve"}
                </button>
            </div>
        </article>
    );
}
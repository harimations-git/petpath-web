import { Building2, CalendarDays, Mail } from "lucide-react";
import { formatDate } from "../../../../../utils/listings/displayFormatting";

import OrganisationDetailsSection from "./OrganisationDetailsSection";

type OrganisationInformationSectionProps = {
    charityName: string;
    charityId?: string;
    email: string;

    createdAt: string;
    reviewedAt?: string;
};

/**
 * Component that displays the details of the organisation account
 * - name, id, email, date created, date approved
 * @param param0 
 * @returns 
 */
export default function OrganisationInformationSection({
    charityName,
    charityId,
    email,
    createdAt,
    reviewedAt,
}: OrganisationInformationSectionProps) {
    return (
        <OrganisationDetailsSection
            title="Organisation details"
            description="Verified account and charity information."
            icon={<Building2 size={20}/>}
        >
            <dl className="admin-organisation-information-grid">
                <div>
                    <dt> Organisation name</dt>
                    <dd>{charityName}</dd>
                </div>

                <div>
                    <dt>Charity ID</dt>

                    <dd>{charityId || "Not provided"}</dd>
                </div>

                <div>
                    <dt>
                        <Mail size={14}/>
                        Account email
                    </dt>

                    <dd>{email}</dd>
                </div>

                <div>
                    <dt>
                        <CalendarDays size={14}/>
                        Account created
                    </dt>

                    <dd>{formatDate(createdAt)}</dd>
                </div>

                <div>
                    <dt>
                        <CalendarDays size={14}/>
                        Approved
                    </dt>

                    <dd>{reviewedAt ? formatDate(reviewedAt): "Not provided"}</dd>
                </div>
            </dl>
        </OrganisationDetailsSection>
    );
}
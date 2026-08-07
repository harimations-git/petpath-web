import {Building2, ShieldCheck } from "lucide-react";
import Card from "../../../Card";
import { formatDate } from "../../../../../utils/listings/displayFormatting";

type OrganisationProfileSummaryProps = {
    organisationName: string;
    profileImageUrl?: string | null;
    createdAt: string;
};

/**
 * Component used to display the basic organisation profile details.
 * Includes the profile picture and title of the organisation.
 * @param param0 
 * @returns 
 */
export default function OrganisationProfileSummary({
    organisationName,
    profileImageUrl,
    createdAt,
}: OrganisationProfileSummaryProps) {
    return (
        <Card className="admin-organisation-profile-summary">
            <div className="admin-organisation-profile-image">
                {profileImageUrl ? (
                    <img
                        src={ profileImageUrl}
                        alt={`${organisationName} profile`}
                    />
                ) : (
                    <Building2 size={32}/>
                )}
            </div>

            <div className="admin-organisation-profile-summary-content">
                <span className="admin-organisation-profile-status">
                    <ShieldCheck size={14}/>

                    Verified account
                </span>

                <h2>
                    {organisationName}
                </h2>

                <p>
                    Organisation account
                    created{" "}
                    {formatDate(createdAt)}
                </p>
            </div>
        </Card>
    );
}
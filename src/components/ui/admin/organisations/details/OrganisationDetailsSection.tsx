import type { ReactNode } from "react";

import Card from "../../../Card";

type OrganisationDetailsSectionProps = {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
};

/**
 * Component used to display the organisation's details
 * @param param0 
 * @returns 
 */
export default function OrganisationDetailsSection({
    title,
    description,
    icon,
    children,
}: OrganisationDetailsSectionProps) {
    return (
        <Card className="admin-organisation-details-section">
            <div className="admin-organisation-details-section-heading">
                <div className="admin-organisation-details-section-icon">
                    {icon}
                </div>

                <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>

            {children}
        </Card>
    );
}
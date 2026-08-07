import { FileText } from "lucide-react";

import OrganisationDetailsSection from "./OrganisationDetailsSection";

type OrganisationAboutSectionProps = {
    description?: string;
};

/**
 * Component that displays the organisation's description
 * @param param0 
 * @returns 
 */
export default function OrganisationAboutSection({
    description,
}: OrganisationAboutSectionProps) {
    return (
        <OrganisationDetailsSection
            title="About the organisation"
            description="Information provided by the organisation."
            icon={<FileText size={20}/>}
        >
            <div className="admin-organisation-about">
                {description ? (
                    <p>
                        {description}
                    </p>
                ) : (
                    <p className="admin-organisation-details-muted">
                        No organisation
                        description has been
                        provided.
                    </p>
                )}
            </div>
        </OrganisationDetailsSection>
    );
}
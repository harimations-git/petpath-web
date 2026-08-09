import { ExternalLink, Globe2 } from "lucide-react";
import OrganisationDetailsSection from "./OrganisationDetailsSection";

type OrganisationWebsiteSectionProps = {
    websiteUrl?: string;
};

/**
 * Component that displays the organisation website with an openable link
 * @param param0 
 * @returns 
 */
export default function OrganisationWebsiteSection({
    websiteUrl,
}: OrganisationWebsiteSectionProps) {
    return (
        <OrganisationDetailsSection
            title="Website"
            description="Website supplied by the organisation."
            icon={<Globe2 size={20}/>}
        >
            {websiteUrl ? (
                <a
                    className="admin-organisation-website-link"
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Globe2
                        size={18}
                    />

                    Visit organisation website

                    <ExternalLink size={15}/>
                </a>
            ) : (
                <p className="admin-organisation-details-muted">
                    No website has been
                    provided.
                </p>
            )}
        </OrganisationDetailsSection>
    );
}
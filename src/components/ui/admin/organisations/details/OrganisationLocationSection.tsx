import { MapPin } from "lucide-react";
import OrganisationDetailsSection from "./OrganisationDetailsSection";

type OrganisationLocationSectionProps = {
    location: string;
};

/**
 * Component that displays the organisations location
 * @param param0 
 * @returns 
 */
export default function OrganisationLocationSection({
    location,
}: OrganisationLocationSectionProps) {
    return (
        <OrganisationDetailsSection
            title="Location"
            description="Registered organisation location."
            icon={<MapPin size={20}/>}
        >
            <div className="admin-organisation-location">
                <MapPin size={20}/>

                <div>
                    <span>Organisation address</span>

                    <strong>
                        {location || "Location not provided"}
                    </strong>
                </div>
            </div>
        </OrganisationDetailsSection>
    );
}
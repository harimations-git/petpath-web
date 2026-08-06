import { Building2, MapPin } from "lucide-react";

import Card from "../../../Card";
import type { AdminListingDetails } from "../../../../../types/admin/adminListing";
import { formatLocation } from "../../../../../utils/listings/displayFormatting";

type ListingOrganisationSummaryProps = {
    listing: AdminListingDetails;
};

export default function ListingOrganisationSummary({
    listing,
}: ListingOrganisationSummaryProps) {
    return (
        <Card className="admin-listing-review-organisation">
            <div className="admin-listing-review-organisation-icon">
                <Building2 size={22} />
            </div>

            <div>
                <span>
                    Submitted by
                </span>

                <strong>
                    {listing.organisationName}
                </strong>

                <p>
                    {formatLocation([
                        listing.locationTown,
                        listing.locationCounty,
                        listing.locationCountry,
                    ])}
                </p>
            </div>

            <MapPin size={20} />
        </Card>
    );
}
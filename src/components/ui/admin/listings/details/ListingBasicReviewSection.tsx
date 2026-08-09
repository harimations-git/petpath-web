import {
    ExternalLink,
    PawPrint,
} from "lucide-react";

import type { AdminListingDetails } from "../../../../../types/admin/adminListing";
import {formatAdoptionFee, formatDisplayValue, formatLocation } from "../../../../../utils/listings/displayFormatting";

import ReadOnlyField from "../../ReadOnlyField";
import ReviewSection from "./ReviewSection";

type ListingBasicsReviewSectionProps = {
    listing: AdminListingDetails;
};

export default function ListingBasicsReviewSection({
    listing,
}: ListingBasicsReviewSectionProps) {
    return (
        <ReviewSection
            title="Listing basics"
            description="General information supplied for this listing."
            icon={PawPrint}
        >
            <div className="admin-listing-review-grid">
                <ReadOnlyField
                    label="Listing title"
                    value={listing.title}
                />

                <ReadOnlyField
                    label="Organisation"
                    value={listing.organisationName}
                />

                <ReadOnlyField
                    label="Listing type"
                    value={formatDisplayValue(listing.listingType)}
                />

                <ReadOnlyField
                    label="Animal type"
                    value={formatDisplayValue(listing.animalType)}
                />

                <ReadOnlyField
                    label="Number of animals"
                    value={listing.numberOfAnimals}
                />

                <ReadOnlyField
                    label="Adoption fee"
                    value={formatAdoptionFee(listing.adoptionFee)}
                />

                <ReadOnlyField
                    label="Availability"
                    value={formatDisplayValue(listing.availabilityStatus ?? "")}
                />

                <ReadOnlyField
                    label="Location"
                    value={formatLocation([
                        listing.locationTown,
                        listing.locationCounty,
                        listing.locationPostcode,
                        listing.locationCountry,
                    ])}
                />

                <ReadOnlyField
                    label="Description"
                    fullWidth
                    value={
                        <p className="admin-listing-review-description">
                            {listing.description}
                        </p>
                    }
                />

                <ReadOnlyField
                    label="Listing website"
                    fullWidth
                    value={
                        listing.enquiryUrl ? (
                            <a
                                className="admin-listing-review-link"
                                href={listing.enquiryUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {listing.enquiryUrl}

                                <ExternalLink size={15} />
                            </a>
                        ) : undefined
                    }
                />
            </div>
        </ReviewSection>
    );
}
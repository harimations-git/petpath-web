import {
    ExternalLink,
    FileText,
    HeartPulse,
} from "lucide-react";

import type { AdminListingDetails } from "../../../../../types/admin/adminListing";
import { formatDisplayValue } from "../../../../../utils/listings/displayFormatting";

import ReadOnlyField from "../../ReadOnlyField";
import ReviewSection from "./ReviewSection";

type ListingHealthReviewSectionProps = {
    listing: AdminListingDetails;
};

export default function ListingHealthReviewSection({
    listing,
}: ListingHealthReviewSectionProps) {
    return (
        <ReviewSection
            title="Health care"
            description="Health information and supporting veterinary documents."
            icon={HeartPulse}
        >
            <div className="admin-listing-review-grid">
                <ReadOnlyField
                    label="Vaccination status"
                    value={formatDisplayValue(listing.vaccinationStatus ?? "")}
                />

                <ReadOnlyField
                    label="Microchip status"
                    value={formatDisplayValue(listing.microchipStatus ?? "")}
                />

                <ReadOnlyField
                    label="Neutered status"
                    value={formatDisplayValue(listing.neuteredStatus ?? "")}
                />

                <ReadOnlyField
                    label="Health notes"
                    value={listing.healthNotes}
                    fullWidth
                />
            </div>

            <div className="admin-listing-review-documents">
                <h3>
                    Veterinary documents
                </h3>

                {listing.veterinaryDocuments.length > 0 ? (
                    <div className="admin-listing-review-document-list">
                        {listing.veterinaryDocuments.map(
                            (document) => (
                                <a
                                    key={`${document.name}-${document.url}`}
                                    href={document.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="admin-listing-review-document"
                                >
                                    <FileText size={19} />

                                    <span>
                                        {document.name}
                                    </span>

                                    <ExternalLink size={15} />
                                </a>
                            )
                        )}
                    </div>
                ) : (
                    <p className="admin-listing-review-no-documents">
                        No veterinary documents were supplied.
                    </p>
                )}
            </div>
        </ReviewSection>
    );
}
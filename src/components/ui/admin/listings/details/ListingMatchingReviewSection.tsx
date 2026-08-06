import { SlidersHorizontal } from "lucide-react";
import { MATCHING_PROFILE_FIELD_ORDER, type AdminListingDetails } from "../../../../../types/admin/adminListing";
import { formatDisplayValue, formatMatchingValue } from "../../../../../utils/listings/displayFormatting";

import ReadOnlyField from "../../ReadOnlyField";
import ReviewSection from "./ReviewSection";

type ListingMatchingReviewSectionProps = {
    matchingProfile: AdminListingDetails["matchingProfile"];
};

export default function ListingMatchingReviewSection({
    matchingProfile,
}: ListingMatchingReviewSectionProps) {
    const matchingEntries =
        matchingProfile
            ? MATCHING_PROFILE_FIELD_ORDER
                .map((key) => ({key, value:matchingProfile[key]})).filter(
                    ({ value }) =>
                        value !== undefined &&
                        value !== null &&
                        value !== ""
                )
            : [];

    return (
        <ReviewSection
            title="Matching profile"
            description="Lifestyle information used to match this listing with suitable users."
            icon={SlidersHorizontal}
        >
            {matchingEntries.length > 0 ? (
                <div className="admin-listing-review-grid">
                    {matchingEntries.map(
                        ({ key, value }) => (
                            <ReadOnlyField
                                key={key}
                                label={formatDisplayValue(key)}
                                value={formatMatchingValue(value)}
                            />
                        )
                    )}
                </div>
            ) : (
                <div className="admin-listing-review-empty-section">
                    <SlidersHorizontal
                        size={28}
                    />

                    <p>
                        No matching profile
                        information was returned.
                    </p>
                </div>
            )}
        </ReviewSection>
    );
}
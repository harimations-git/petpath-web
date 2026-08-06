import {
    Image as ImageIcon,
} from "lucide-react";

import type {
    AdminListingDetails,
} from "../../../../../types/admin/adminListing";

import ReviewSection from "./ReviewSection";

type ListingPhotosReviewSectionProps = {
    listingTitle: string;
    photos: AdminListingDetails["photos"];
};

export default function ListingPhotosReviewSection({
    listingTitle,
    photos,
}: ListingPhotosReviewSectionProps) {
    return (
        <ReviewSection
            title="Listing photos"
            description="Images submitted by the organisation."
            icon={ImageIcon}
        >
            {photos.length > 0 ? (
                <div className="admin-listing-review-photos">
                    {photos.map(
                        (photo, index) => (
                            <div
                                key={`${photo}-${index}`}
                                className="admin-listing-review-photo"
                            >
                                <img
                                    src={photo}
                                    alt={`${listingTitle} photo ${index + 1}`}
                                />
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="admin-listing-review-empty-section">
                    <ImageIcon size={28} />

                    <p>
                        No listing photos were supplied.
                    </p>
                </div>
            )}
        </ReviewSection>
    );
}
import {
    Clock3,
    PawPrint,
} from "lucide-react";

import type { PetListingSummary } from "../../../types/listing";

import "./PetListingCard.css";

type PetListingCardProps = {
    listing: PetListingSummary;
    onView: (listingId: string) => void;
};

function formatAnimalType(value: string) {
    return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}

export default function PetListingCard({
    listing,
    onView,
}: PetListingCardProps) {
    //format the status name
    const isPending = listing.reviewStatus === "pending";
    const status = isPending
        ? "Pending Review"
        : formatAnimalType(
            listing.availabilityStatus
        );

    //get the class name so it can change colour
    const statusClassName = isPending
        ? "my-listing-status-pending"
        : `my-listing-status-${listing.availabilityStatus}`;

    return (
        <article className="my-listing-card">
            <div className="my-listing-image">
                {listing.primaryPhotoUrl ? (
                    <img
                        src={listing.primaryPhotoUrl}
                        alt={listing.title}
                    />
                ) : (
                    <PawPrint size={34} />
                )}
            </div>

            <div className="my-listing-content">
                <div className="my-listing-main">
                    <h2>{listing.title}</h2>

                    <p className="my-listing-summary">
                        {formatAnimalType(
                            listing.animalType
                        )}
                        <span>•</span>
                        {listing.numberOfAnimals}{" "}
                        {listing.numberOfAnimals === 1
                            ? "animal"
                            : "animals"}
                        <span>•</span>

                        {listing.adoptionFee === 0
                            ? "No Fee"
                            : `£${listing.adoptionFee}`}

                    </p>

                    <span
                        className={`my-listing-status ${statusClassName}`}
                    >
                        {isPending && (
                            <Clock3 size={17} />
                        )}

                        {status}
                    </span>

                </div>

                {/*!!! Change the look of this */}
                <div className="my-listing-actions">
                    <button type="button">
                        Edit
                    </button>

                    <span className="my-listing-action-divider">
                        |
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            onView(
                                listing.listingId
                            )
                        }
                    >
                        View
                    </button>

                    <span className="my-listing-action-divider">
                        |
                    </span>

                    <button type="button">
                        {isPending
                            ? "Delete"
                            : "Pause"}
                    </button>
                </div>
            </div>
        </article>
    );
}
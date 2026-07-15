import {
    Clock3,
    PawPrint,
    PoundSterling,
    UserRound,
    UsersRound,
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
                    <div className="my-listing-title-row">
                        <h2>{listing.title}</h2>
                    </div>

                    <ul
                        className="my-listing-meta"
                    >
                        <li>
                            <PawPrint size={16} />

                            <span>
                                {formatAnimalType(
                                    listing.animalType
                                )}
                            </span>
                        </li>

                        <li>
                            {listing.numberOfAnimals === 1 ? (
                                <UserRound size={16} />
                            ) : (
                                <UsersRound size={16} />
                            )}

                            <span>
                                {listing.numberOfAnimals === 1
                                    ? "Individual listing"
                                    : `${listing.numberOfAnimals} animals`}
                            </span>
                        </li>

                        <li>
                            <PoundSterling size={16} />

                            <span>
                                £{listing.adoptionFee} adoption fee
                            </span>
                        </li>

                        <span
                            className={`my-listing-status ${statusClassName}`}
                        >
                            {isPending && (
                                <Clock3 size={15} />
                            )}

                            {status}
                        </span>
                    </ul>
                </div>

                {/*!!! Change the look of this */}
                <div className="my-listing-actions">
                    <button
                        type="button"
                        className="my-listing-view-button"
                        onClick={() =>
                            onView(listing.listingId)
                        }
                    >
                        View listing
                    </button>
                </div>
            </div>
        </article>
    );
}
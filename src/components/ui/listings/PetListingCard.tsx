import {
    Clock3,
    PawPrint,
    PoundSterling,
    UserRound,
    UsersRound,
} from "lucide-react";

import type { ListingAvailabilityStatus, PetListingSummary } from "../../../types/listing";

import "./PetListingCard.css";

type PetListingCardProps = {
    listing: PetListingSummary;
    onView: (listingId: string) => void;
    onAvailabilityChange: (
        listingId: string,
        availabilityStatus: ListingAvailabilityStatus
    ) => Promise<void> | void;
    isUpdatingAvailability?: boolean;
};

const availabilityOptions: {
    label: string;
    value: ListingAvailabilityStatus;
}[] = [
        {
            label: "Available",
            value: "available",
        },
        {
            label: "Reserved",
            value: "reserved",
        },
        {
            label: "Rehomed",
            value: "rehomed",
        },
    ];

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
    onAvailabilityChange,
    isUpdatingAvailability = false,
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

    const canChangeAvailability =
        listing.reviewStatus === "approved";

    async function handleAvailabilityChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        const nextStatus =
            event.target.value as ListingAvailabilityStatus;

        if (
            nextStatus === listing.availabilityStatus
        ) {
            return;
        }

        await onAvailabilityChange(
            listing.listingId,
            nextStatus
        );
    }

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

                        <li>
                            {canChangeAvailability ? (
                                <label className="my-listing-availability-control">
                                    <span className="my-listing-availability-label">
                                        Status
                                    </span>

                                    <select
                                        value={
                                            listing.availabilityStatus
                                        }
                                        onChange={
                                            handleAvailabilityChange
                                        }
                                        disabled={
                                            isUpdatingAvailability
                                        }
                                        aria-label={`Change availability status for ${listing.title}`}
                                        className={`my-listing-availability-select ${statusClassName}`}
                                    >
                                        {availabilityOptions.map(
                                            (option) => (
                                                <option
                                                    key={
                                                        option.value
                                                    }
                                                    value={
                                                        option.value
                                                    }
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </label>
                            ) : (
                                <span
                                    className={`my-listing-status ${statusClassName}`}
                                >
                                    <Clock3 size={15} />
                                    {status}
                                </span>
                            )}
                        </li>
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
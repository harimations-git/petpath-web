import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    PawPrint,
    ArrowRight,
} from "lucide-react";

import type {
    PetListingSummary,
} from "../../../../types/listing";

import "./StatusUpdateCard.css";

type StatusUpdateCardProps = {
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

function getStatusContent(
    listing: PetListingSummary
) {
    if (listing.reviewStatus === "rejected") {
        return {
            label: "Action needed",
            className: "status-update-card-rejected",
            icon: AlertTriangle,
            message:
                listing.reviewReason ||
                "This listing needs changes before it can be approved.",
            buttonText: "Edit and resubmit",
        };
    }

    if (listing.reviewStatus === "pending") {
        return {
            label: "Pending review",
            className: "status-update-card-pending",
            icon: Clock3,
            message:
                "This listing is being reviewed by the PetPath team.",
            buttonText: "View listing",
        };
    }

    return {
        label: "Approved",
        className: "status-update-card-approved",
        icon: CheckCircle2,
        message:
            "This listing has been approved and can appear to PetPath users.",
        buttonText: "View listing",
    };
}

export default function StatusUpdateCard({
    listing,
    onView,
}: StatusUpdateCardProps) {
    const {
        label,
        className,
        icon: Icon,
        message,
        buttonText,
    } = getStatusContent(listing);

    return (
        <article
            className={`status-update-card ${className}`}
        >
            <div className="status-update-photo">
                {listing.primaryPhotoUrl ? (
                    <img
                        src={listing.primaryPhotoUrl}
                        alt={listing.title}
                    />
                ) : (
                    <PawPrint size={34} />
                )}
            </div>

            <div className="status-update-content">
                <div className="status-update-top-row">
                    <span className="status-update-badge">
                        <Icon size={15} />
                        {label}
                    </span>

                    {listing.reviewedAt && listing.reviewStatus === "rejected" && (
                        <span className="status-update-date">
                            Reviewed{" "}
                            {new Date(
                                listing.reviewedAt
                            ).toLocaleDateString()}
                        </span>
                    )}
                </div>

                <h2>{listing.title}</h2>

                <p><strong>Reason: </strong>{message}</p>

                <div className="status-update-meta">
                    <span>
                        <PawPrint size={15} />
                        {formatAnimalType(
                            listing.animalType
                        )}
                    </span>

                    <span>
                        {listing.numberOfAnimals === 1
                            ? "1 animal"
                            : `${listing.numberOfAnimals} animals`}
                    </span>
                </div>
            </div>

            <div className="status-update-actions">
                <button
                    type="button"
                    className="status-update-button"
                    onClick={() =>
                        onView(listing.listingId)
                    }
                >
                    {buttonText}
                    <ArrowRight size={16} />
                </button>
            </div>
        </article>
    );
}
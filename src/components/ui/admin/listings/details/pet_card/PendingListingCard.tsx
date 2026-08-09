import {
    Building2,
    Clock3,
    Eye,
    PawPrint,
    ShieldCheck,
} from "lucide-react";

import { formatDate, formatDisplayValue } from "../../../../../../utils/listings/displayFormatting";

import type { PendingListing } from "../../../../../../types/admin/adminListing";

type PendingListingCardProps = {
    listing: PendingListing;
    onView: (listing: PendingListing) => void;
};

export default function PendingListingCard({
    listing,
    onView,
}: PendingListingCardProps) {
    return (
        <article className="admin-listing-card">
            <div className="admin-listing-card-main">
                <div className="admin-listing-icon">
                    <PawPrint size={22} />
                </div>

                <div className="admin-listing-content">
                    <div className="admin-listing-heading">
                        <div>
                            <span className="admin-listing-status">
                                <ShieldCheck size={14} />

                                Pending review
                            </span>

                            <h2>
                                {listing.title}
                            </h2>
                        </div>
                    </div>

                    <dl className="admin-listing-details">
                        <div>
                            <dt>
                                <Building2 size={14} />

                                Organisation
                            </dt>

                            <dd>
                                {listing.organisationName}
                            </dd>
                        </div>

                        <div>
                            <dt>
                                <PawPrint size={14} />

                                Listing
                            </dt>

                            <dd>
                                {formatDisplayValue(listing.animalType)}
                                {" · "}
                                {formatDisplayValue(listing.listingType)}
                            </dd>
                        </div>

                        <div>
                            <dt>
                                <Clock3 size={14} />

                                Submitted
                            </dt>

                            <dd>
                                {formatDate(listing.submittedAt)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="admin-listing-actions">
                <button
                    type="button"
                    className="admin-listing-action admin-listing-view-button"
                    onClick={() => onView(listing)}
                >
                    <Eye size={17} />

                    View listing
                </button>
            </div>
        </article>
    );
}
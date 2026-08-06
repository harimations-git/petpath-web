import {
    BadgeCheck,
    Building2,
    CalendarCheck,
    Clock3,
    Eye,
    PawPrint,
    Tag,
} from "lucide-react";

import type { ApprovedListing } from "../../../../../../types/admin/adminListing";
import { formatDate, formatDisplayValue } from "../../../../../../utils/listings/displayFormatting";

import Card from "../../../../Card";

type ApprovedListingCardProps = {
    listing: ApprovedListing;
    onView: (listing: ApprovedListing) => void;
};

export default function ApprovedListingCard({
    listing,
    onView,
}: ApprovedListingCardProps) {
    const lastUpdatedAt = listing.updatedAt ?? listing.reviewedAt;

    return (
         <Card className="admin-listing-card">
            <div className="admin-listing-card-main">
                <div className="admin-listing-icon">
                    <PawPrint size={23} />
                </div>

                <div className="admin-listing-content">
                    <div className="admin-listing-heading">
                        <div>
                            <p className="admin-listing-status">
                                <BadgeCheck
                                    size={15}
                                />

                                Approved listing
                            </p>

                            <h2>
                                {listing.title}
                            </h2>
                        </div>

                        <span
                            className={[
                                "admin-listing-availability-status",
                                `admin-listing-card-status-${listing.availabilityStatus}`,
                            ].join(" ")}
                        >
                            {formatDisplayValue(
                                listing.availabilityStatus
                            )}
                        </span>
                    </div>

                    <dl className="admin-listing-details">
                        <div>
                            <dt>
                                <Building2
                                    size={14}
                                />

                                Organisation
                            </dt>

                            <dd>
                                {
                                    listing.organisationName
                                }
                            </dd>
                        </div>

                        <div>
                            <dt>
                                <Tag size={14} />

                                Listing
                            </dt>

                            <dd>
                                {formatDisplayValue(
                                    listing.animalType
                                )}
                                {" · "}
                                {formatDisplayValue(
                                    listing.listingType
                                )}
                            </dd>
                        </div>

                        <div>
                            <dt>
                                {lastUpdatedAt ? (
                                    <Clock3
                                        size={14}
                                    />
                                ) : (
                                    <CalendarCheck
                                        size={14}
                                    />
                                )}

                                Last updated
                            </dt>

                            <dd>
                                {lastUpdatedAt
                                    ? formatDate(
                                          lastUpdatedAt
                                      )
                                    : "Not provided"}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="admin-listing-actions">
                <button
                    type="button"
                    className="admin-listing-action admin-listing-view-button"
                    onClick={() =>
                        onView(listing)
                    }
                >
                    <Eye size={17} />

                    View listing
                </button>
            </div>
        </Card>
    );
}
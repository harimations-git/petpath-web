import type {
    PetListingSummary,
} from "../../types/listing";

export type ListingStatistics = {
    activeListings: number;
    pendingReview: number;
    reservedPets: number;
    rehomedThisMonth: number;
};

/**
 * Returns the users listing statistics
 * e.g. active/pending/rehomed listings
 * @param listings 
 * @returns 
 */
export function getListingStatistics(
    listings: PetListingSummary[]
): ListingStatistics {
    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    //These calculate the four statistics. They filter the approved ones into an new array.
    //Later we will use .length to count how many of those status types exist
    const activeListings = listings.filter(
        (listing) =>
            listing.reviewStatus === "approved" &&
            listing.availabilityStatus === "available"
    ).length;

    const pendingReview = listings.filter(
        (listing) =>
            listing.reviewStatus === "pending"
    ).length;

    const reservedPets = listings
        .filter(
            (listing) =>
                listing.availabilityStatus === "reserved"
        )
        .reduce(
            (total, listing) =>
                total + listing.numberOfAnimals,
            0
        );

    const rehomedThisMonth = listings
        .filter((listing) => {
            if (
                listing.availabilityStatus !==
                "rehomed"
            ) {
                return false;
            }

            const updatedDate =
                new Date(listing.updatedAt);

            return (
                updatedDate.getMonth() ===
                    currentMonth &&
                updatedDate.getFullYear() ===
                    currentYear
            );
        })
        .reduce(
            (total, listing) =>
                total + listing.numberOfAnimals,
            0
        );

    return {
        activeListings,
        pendingReview,
        reservedPets,
        rehomedThisMonth,
    };
}
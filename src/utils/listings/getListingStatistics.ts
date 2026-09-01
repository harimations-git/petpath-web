import type { PetListingSummary } from "../../types/listing";

/**
 * Stores the listing statistics displayed on the shelter dashboard.
 */
export type ListingStatistics = {
    activeListings: number;
    pendingReview: number;
    reservedPets: number;
    rehomedThisMonth: number;
};

/**
 * Calculates the listing statistics displayed on the shelter dashboard
 * e.g. active/pending/rehomed listings
 * @param listings
 * @param reviewUpdates
 */
export function getListingStatistics(
    listings: PetListingSummary[],
    reviewUpdates: PetListingSummary[] = listings
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

    //Count the total number of animals in pending listings
    const pendingReview = reviewUpdates.filter(
        (listing) => listing.reviewStatus === "pending"
    ).length;

    //Count the total number of animals in reserved listings
    const reservedPets = listings
        .filter(
            (listing) => listing.availabilityStatus === "reserved"
        )
        .reduce(
            (total, listing) => total + listing.numberOfAnimals,
            0
        );

    //Find listings that were rehomed during the current month
    const rehomedThisMonth = listings
        .filter((listing) => {
            if (listing.availabilityStatus !== "rehomed") {
                return false;
            }

            const updatedDate = new Date(listing.updatedAt);

            //Check that it was updated in the current month and year
            return (
                updatedDate.getMonth() === currentMonth &&
                updatedDate.getFullYear() === currentYear
            );
            //Add together the number of animals in the rehomed listings
        }).reduce((total, listing) => total + listing.numberOfAnimals, 0);

    return {
        activeListings,
        pendingReview,
        reservedPets,
        rehomedThisMonth,
    };
}
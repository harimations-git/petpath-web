import { useCallback, useEffect, useState } from "react";
import { deleteAdminListing, getAdminListingDetails, reviewListing } from "../../services/admin/adminListingService";
import type { AdminListingDetails } from "../../types/admin/adminListing";
import type { AdminReviewDecision } from "../../types/admin/adminManagement";

/**
 * Loads an individual listing and handles
 * the admin's review decision.
 */
export function useAdminListingReview(listingId?: string) {
    const [listing, setListing] = useState<AdminListingDetails | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [isReviewing, setIsReviewing] = useState(false);

    const [error, setError] = useState("");

    const [reviewError, setReviewError] = useState("");

    const [isDeleting, setIsDeleting] = useState(false);

    const [deleteError, setDeleteError] = useState("");

    const loadListing =
        useCallback(async () => {
            if (!listingId) {
                setListing(null);

                setError("Listing ID is missing.");

                setIsLoading(false);

                return;
            }

            setIsLoading(true);
            setError("");

            try {
                const loadedListing = await getAdminListingDetails(listingId);

                setListing(loadedListing);
            } catch (loadError) {
                setListing(null);

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load the listing."
                );
            } finally {
                setIsLoading(false);
            }
        }, [listingId]);

    useEffect(() => {
        document.title = "Listing Review | PetPath";
    }, []);

    useEffect(() => {
        void loadListing();
    }, [loadListing]);

    const submitReview =
        useCallback(
            async (
                decision: AdminReviewDecision,
                reason?: string
            ) => {
                if (!listingId || isReviewing) {
                    return false;
                }

                setIsReviewing(true);
                setReviewError("");

                try {
                    await reviewListing({ listingId, decision, reason });

                    return true;
                } catch (
                reviewRequestError
                ) {
                    setReviewError(
                        reviewRequestError
                            instanceof Error
                            ? reviewRequestError.message
                            : "Unable to review the listing."
                    );

                    return false;
                } finally {
                    setIsReviewing(false);
                }
            },
            [listingId, isReviewing]
        );

    const approveListing =
        useCallback(
            () =>
                submitReview("approved"),
            [submitReview]
        );

    const rejectListing =
        useCallback(
            (reason: string) =>
                submitReview("rejected", reason),
            [submitReview]
        );

    const deleteListing =
        useCallback(async () => {
            if (
                !listingId ||
                isDeleting ||
                isReviewing
            ) {
                return false;
            }

            setIsDeleting(true);
            setDeleteError("");

            try {
                await deleteAdminListing(listingId);

                return true;
            } catch (deleteRequestError) {
                setDeleteError(
                    deleteRequestError
                        instanceof Error
                        ? deleteRequestError.message
                        : "Unable to delete the listing."
                );

                return false;
            } finally {
                setIsDeleting(false);
            }
        }, [listingId, isDeleting, isReviewing]);

    return {
        listing,

        isLoading,
        isReviewing,
        isDeleting,

        error,
        reviewError,
        deleteError,

        retry: loadListing,

        approveListing,
        rejectListing,
        deleteListing,
    };
}
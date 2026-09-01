import { ArrowLeft, Check, ClipboardCheck, ShieldCheck, Trash2, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/ui/Card";
import CustomButton from "../../../components/ui/CustomButton";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import AdminAccountMenu from "../../../components/ui/admin/profile/AdminAccountMenu";
import { routes } from "../../../constants/routes";
import { formatDate, formatDisplayValue } from "../../../utils/listings/displayFormatting";
import "./ViewListing.css";
import ListingBasicsReviewSection from "../../../components/ui/admin/listings/details/ListingBasicReviewSection";
import ListingPhotosReviewSection from "../../../components/ui/admin/listings/details/ListingPhotosReviewSection";
import ListingAnimalsReviewSection from "../../../components/ui/admin/listings/details/ListingAnimalsReviewSection";
import ListingMatchingReviewSection from "../../../components/ui/admin/listings/details/ListingMatchingReviewSection";
import ListingHealthReviewSection from "../../../components/ui/admin/listings/details/ListingHealthReviewSection";
import ListingOrganisationSummary from "../../../components/ui/admin/listings/details/ListingOrganisationSummary";
import ListingReviewActions from "../../../components/ui/admin/listings/details/ListingReviewActions";
import { useAdminListingReview } from "../../../hooks/admin/useAdminListingReview";
import { useState } from "react";
import InfoModal from "../../../components/ui/InfoModal";
import "../../organisation/dashboard/PageHeading.css";

type ReviewModalType =
    | "approve"
    | "reject"
    | "delete"
    | null;

/**
* Displays the full details of a pet listing for admin review.
* Handles approving, rejecting and deleting the listing.
*/
export default function ListingReview() {
    const navigate = useNavigate();

    const { listingId } = useParams<{ listingId: string; }>();

    // Store which review action modal is currently open
    const [modalType, setModalType] = useState<ReviewModalType>(null);

    const [rejectionReason, setRejectionReason] = useState("");

    const [rejectionError, setRejectionError] = useState("");

    const {
        listing,

        isLoading,
        isReviewing,
        isDeleting,

        error,
        reviewError,
        deleteError,

        retry,

        approveListing,
        rejectListing,
        deleteListing,
    } = useAdminListingReview(listingId);

    const isProcessing = isReviewing || isDeleting;

    //Return to the pending listings page
    function goBackToListings() {
        navigate(routes.admin.listings.pendingListings);
    }

    //Open the approval confirmation modal
    function openApproveModal() {
        setModalType("approve");
        setRejectionReason("");
        setRejectionError("");
    }

    //Open the rejection modal and clear any previous reason
    function openRejectModal() {
        setModalType("reject");
        setRejectionReason("");
        setRejectionError("");
    }

    //Open the deletion confirmation modal
    function openDeleteModal() {
        setModalType("delete");
        setRejectionReason("");
        setRejectionError("");
    }

    //Close the current modal unless an action is still processing
    function closeReviewModal() {
        if (isProcessing) {
            return;
        }

        setModalType(null);
        setRejectionReason("");
        setRejectionError("");
    }

    //Approve the listing and return to the pending listings page
    async function confirmApproval() {
        const wasSuccessful = await approveListing();

        if (!wasSuccessful) {
            return;
        }

        closeReviewModal();
        goBackToListings();
    }

    //Validate the rejection reason and reject the listing
    async function confirmRejection() {
        const reason = rejectionReason.trim();

        if (!reason) {
            setRejectionError("Please provide a rejection reason.");

            return;
        }

        const wasSuccessful = await rejectListing(reason);

        if (!wasSuccessful) {
            return;
        }

        closeReviewModal();
        goBackToListings();
    }

    
    //Update the rejection reason and clear its error once valid
    function handleRejectionReasonChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = event.target.value;

        setRejectionReason(value);

        if (value.trim()) {
            setRejectionError("");
        }
    }

    //Permanently delete the listing and return to all listings
    async function confirmDeletion() {
        const wasSuccessful = await deleteListing();

        if (!wasSuccessful) {
            return;
        }

        closeReviewModal();

        navigate(routes.admin.listings.allListings);
    }

    if (isLoading) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading listing..."
            />
        );
    }

    if (error || !listing) {
        return (
            <main className="page-body admin-listings-page">
                <Card className="admin-listing-review-error">
                    <ClipboardCheck
                        size={34}
                    />

                    <h2>
                        Unable to load listing
                    </h2>

                    <p>
                        {error || "The listing information could not be loaded."}
                    </p>

                    <div className="admin-listing-review-error-actions">
                        <CustomButton
                            label="Back to listings"
                            icon={<ArrowLeft size={18} />}
                            onClick={goBackToListings}
                        />

                        <button
                            type="button"
                            onClick={() => void retry()}
                        >
                            Try again
                        </button>
                    </div>
                </Card>
            </main>
        );
    }
    return (
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>
                        {listing.title}
                    </h1>

                    <p>
                        View the pet information
                        submitted by{" "}
                        <strong>
                            {listing.organisationName}
                        </strong>
                        .
                    </p>
                </div>

                <div className="page-account-menu">
                    <AdminAccountMenu />
                </div>
            </header>

            <Card className="admin-listing-review-summary">
                <div className="admin-listing-review-summary-icon">
                    <ShieldCheck size={25} />
                </div>

                <div className="admin-listing-review-summary-content">
                    <span className="admin-listing-review-status">
                        {formatDisplayValue(listing.reviewStatus)}
                    </span>

                    <h2>
                        {listing.reviewStatus === "pending" ? "Listing awaiting review" : "Approved listing"}
                    </h2>

                    <p>
                        Submitted by{" "}
                        {listing.organisationName} on{" "}
                        {formatDate(listing.createdAt)}
                    </p>
                </div>
            </Card>

            <div className="admin-listing-review-sections">
                <ListingBasicsReviewSection
                    listing={listing}
                />

                <ListingPhotosReviewSection
                    listingTitle={listing.title}
                    photos={listing.photos}
                />

                <ListingAnimalsReviewSection
                    animals={listing.animals}
                />

                <ListingMatchingReviewSection
                    matchingProfile={listing.matchingProfile}
                />

                <ListingHealthReviewSection
                    listing={listing}
                />

                <ListingOrganisationSummary
                    listing={listing}
                />
                <ListingReviewActions
                    reviewStatus={listing.reviewStatus}
                    isProcessing={isProcessing}
                    onApprove={openApproveModal}
                    onReject={openRejectModal}
                    onDelete={openDeleteModal}
                />

                {(reviewError || deleteError) && (
                    <p className="admin-listing-review-request-error">
                        {reviewError || deleteError}
                    </p>
                )}
            </div>
            
            <InfoModal
                visible={
                    modalType === "approve"
                }
                title="Approve listing?"
                message={`Are you sure you want to approve "${listing.title}"? It will become available to PetPath users.`}
                icon={Check}
                buttonText={
                    isReviewing
                        ? "Approving..."
                        : "Approve listing"
                }
                buttonTextSecondary="Cancel"
                isLoading={isReviewing}
                closeOnBackdrop={!isReviewing}
                onClose={closeReviewModal}
                onConfirm={confirmApproval}
            />

            <InfoModal
                visible={modalType === "reject"}
                title="Reject listing?"
                message={
                    listing.reviewStatus === "approved"
                        ? `Explain why "${listing.title}" is being removed from the approved listings.`
                        : `Explain why "${listing.title}" cannot be approved.`
                }
                icon={XCircle}
                buttonText={
                    isReviewing
                        ? "Rejecting..."
                        : "Reject listing"
                }
                buttonTextSecondary="Cancel"
                isLoading={isReviewing}
                confirmDisabled={!rejectionReason.trim()}
                closeOnBackdrop={!isReviewing}
                primaryButtonStyle={{ background: "var(--color-error)" }}
                onClose={closeReviewModal}
                onConfirm={confirmRejection}
            >
                <div className="admin-listing-rejection-field">
                    <label htmlFor="listing-rejection-reason">
                        Rejection reason
                    </label>

                    <textarea
                        id="listing-rejection-reason"
                        value={rejectionReason}
                        maxLength={100}
                        disabled={isReviewing}
                        placeholder="Explain what needs to be corrected..."
                        onChange={handleRejectionReasonChange}
                    />

                    <small>
                        {rejectionReason.length}/100 characters
                    </small>

                    {rejectionError && (
                        <p className="admin-listing-rejection-error">
                            {rejectionError}
                        </p>
                    )}
                </div>
            </InfoModal>

            <InfoModal
                visible={modalType === "delete"}
                title="Delete listing?"
                message={`Are you sure you want to permanently delete "${listing.title}"?`}
                warning="This action cannot be undone. The listing and its related information will be permanently removed."
                icon={Trash2}
                buttonText={isDeleting ? "Deleting..." : "Delete listing"}
                buttonTextSecondary="Cancel"
                isLoading={isDeleting}
                closeOnBackdrop={!isDeleting}
                primaryButtonStyle={{ background: "var(--color-error)" }}
                onClose={closeReviewModal}
                onConfirm={confirmDeletion}
            />
        </main>
    );
}
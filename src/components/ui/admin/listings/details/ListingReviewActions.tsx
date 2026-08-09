import { Check, Trash2, X } from "lucide-react";

type ListingReviewActionsProps = {
    reviewStatus: string;
    isProcessing: boolean;

    onApprove: () => void;
    onReject: () => void;
    onDelete: () => void;
};

export default function ListingReviewActions({
    reviewStatus,
    isProcessing,
    onApprove,
    onReject,
    onDelete,
}: ListingReviewActionsProps) {
    const isPending = reviewStatus === "pending";

    const isApproved = reviewStatus === "approved";

    if (!isPending && !isApproved) {
        return null;
    }
    return (
        <section className="admin-listing-review-actions">
            <div className="admin-listing-review-actions-text">
                <h2>
                    Review decision
                </h2>

                <p>
                    {isPending
                        ? "Approve the listing or reject it with feedback for the organisation."
                        : "Reject the listing if there is an issue, or permanently delete it."}
                </p>
            </div>

            <div className="admin-listing-review-action-buttons">
                {isPending && (
                    <button
                        type="button"
                        className="admin-listing-review-action admin-listing-review-approve"
                        disabled={isProcessing}
                        onClick={onApprove}
                    >
                        <Check size={18} />

                        Approve listing
                    </button>
                )}
                <button
                    type="button"
                    className="admin-listing-review-action admin-listing-review-reject"
                    disabled={isProcessing}
                    onClick={onReject}
                >
                    <X size={18} />

                    Reject listing
                </button>

                <button
                    type="button"
                    className="admin-listing-review-action admin-listing-review-delete"
                    disabled={isProcessing}
                    onClick={onDelete}
                >
                    <Trash2 size={18} />

                    Delete listing
                </button>
            </div>
        </section>
    );
}
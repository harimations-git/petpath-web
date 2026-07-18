import {
    AlertTriangle,
    MoreHorizontal,
    Trash2,
} from "lucide-react";

import InfoModal from "../../InfoModal";

import "./DeleteListingOption.css";

type ListingOptionsProps = {
    isOpen: boolean;
    showDeleteModal: boolean;
    isDeleting?: boolean;
    onToggle: () => void;
    onOpenDeleteModal: () => void;
    onCloseDeleteModal: () => void;
    onConfirmDelete: () => void | Promise<void>;
};

export default function DeleteListingOption({
    isOpen,
    showDeleteModal,
    isDeleting = false,
    onToggle,
    onOpenDeleteModal,
    onCloseDeleteModal,
    onConfirmDelete,
}: ListingOptionsProps) {
    return (
        <>
            <div className="listing-options">
                <button
                    type="button"
                    className="listing-options-button"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                >
                    <MoreHorizontal size={18} />
                    Listing options
                </button>

                {isOpen && (
                    <div className="listing-options-menu">
                        <button
                            type="button"
                            className="listing-options-danger"
                            onClick={onOpenDeleteModal}
                        >
                            <Trash2 size={17} />
                            Delete listing
                        </button>
                    </div>
                )}
            </div>

            <InfoModal
                visible={showDeleteModal}
                title="Delete this listing?"
                message="This will remove the listing from your shelter account. Adopters will no longer be able to view or enquire about it."
                warning="This action cannot be undone."
                icon={AlertTriangle}
                buttonText={
                    isDeleting
                        ? "Deleting..."
                        : "Delete listing"
                }
                buttonTextSecondary="Cancel"
                onClose={onCloseDeleteModal}
                onConfirm={onConfirmDelete}
            />
        </>
    );
}
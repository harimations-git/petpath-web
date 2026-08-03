import {
    AlertTriangle,
    MoreHorizontal,
    Trash2,
} from "lucide-react";

import InfoModal from "../../InfoModal";

import "./DeleteAccountOption.css";

type DeleteAccountOptionProps = {
    isOpen: boolean;
    showDeleteModal: boolean;
    isDeleting?: boolean;
    onToggle: () => void;
    onOpenDeleteModal: () => void;
    onCloseDeleteModal: () => void;
    onConfirmDelete: () => void | Promise<void>;
};

export default function DeleteAccountOption({
    isOpen,
    showDeleteModal,
    isDeleting = false,
    onToggle,
    onOpenDeleteModal,
    onCloseDeleteModal,
    onConfirmDelete,
}: DeleteAccountOptionProps) {
    return (
        <>
            <div className="account-options">
                <button
                    type="button"
                    className="account-options-button"
                    onClick={onToggle}
                >
                    <MoreHorizontal size={18} />
                    Account options
                </button>

                {isOpen && (
                    <div className="account-options-menu">
                        <button
                            type="button"
                            className="account-options-danger"
                            onClick={onOpenDeleteModal}
                        >
                            <Trash2 size={17} />
                            Delete account
                        </button>
                    </div>
                )}
            </div>

            <InfoModal
                visible={showDeleteModal}
                title="Delete your shelter account?"
                message="This will permanently delete your shelter account, profile details, listings and uploaded listing media."
                warning="This action cannot be undone."
                icon={AlertTriangle}
                buttonText={
                    isDeleting
                        ? "Deleting..."
                        : "Delete account"
                }
                buttonTextSecondary="Cancel"
                onClose={onCloseDeleteModal}
                onConfirm={onConfirmDelete}
            />
        </>
    );
}
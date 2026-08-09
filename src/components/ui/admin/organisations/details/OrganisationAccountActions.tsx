import { Trash2 } from "lucide-react";

type OrganisationAccountActionsProps = {
    isDeleting: boolean;
    onDelete: () => void;
};

/**
 * Component with a button to delete the organisation's account
 * @param param0 
 * @returns 
 */
export default function OrganisationAccountActions({
    isDeleting,
    onDelete,
}: OrganisationAccountActionsProps) {
    return (
        <section className="admin-organisation-account-actions">
            <div className="admin-organisation-account-actions-text">
                <h2>
                    Account options
                </h2>

                <p>
                    Permanently remove this
                    account from
                    PetPath.
                </p>
            </div>

            <div className="admin-organisation-account-action-buttons">
                <button
                    type="button"
                    className="admin-organisation-account-action admin-organisation-delete-button"
                    disabled={isDeleting}
                    onClick={onDelete}
                >
                    <Trash2
                        size={18}
                    />

                    {isDeleting
                        ? "Deleting..."
                        : "Delete account"}
                </button>
            </div>
        </section>
    );
}
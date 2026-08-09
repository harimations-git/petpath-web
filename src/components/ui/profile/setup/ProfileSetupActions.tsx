import CustomButton from "../../../../components/ui/CustomButton";

type ProfileSetupActionsProps = {
    isSaving: boolean;
    error: string;
};

/**
 * Component handles the save button action
 * @param param0 
 * @returns 
 */
export default function ProfileSetupActions({
    isSaving,
    error,
}: ProfileSetupActionsProps) {
    return (
        <>
            {error && (
                <p className="organisation-profile-error">
                    {error}
                </p>
            )}

            <div className="organisation-profile-submit-row">
                <CustomButton
                    label={isSaving ? "Saving profile..." : "Save Settings"}
                    type="submit"
                    fullWidth={false}
                    className="organisation-profile-submit"
                    disabled={isSaving}
                />

                <p>
                    All required fields must
                    be completed before you
                    can create pet listings.
                </p>
            </div>
        </>
    );
}
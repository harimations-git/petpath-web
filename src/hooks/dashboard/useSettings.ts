import {
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useOrganisationProfile } from "../../context/OrganisationProfileContext";
import { useOrganisationProfileImage } from "./useOrganisationProfileImage";
import { deleteOrganisationAccount, updateOrganisationDescription } from "../../services/organisation/organisationService";
import { routes } from "../../constants/routes";
import { signOut } from "aws-amplify/auth";

export function useSettings() {
    const navigate = useNavigate();

    const {
        organisationProfile,
        isLoadingProfile,
        profileError,
        updateCachedOrganisationProfile,
        refreshOrganisationProfile,
        clearCachedOrganisationProfile,
    } = useOrganisationProfile();

    const {
        profileImagePreview,
        profileImageError,
        isUploadingProfileImage,
        changeProfileImage,
    } = useOrganisationProfileImage({
        organisationProfile,
        updateCachedOrganisationProfile,
        refreshOrganisationProfile,
    });

    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isAccountOptionsOpen, setIsAccountOptionsOpen] = useState(false);

    const [descriptionError, setDescriptionError] = useState("");
    const [descriptionSuccess, setDescriptionSuccess] = useState("");
    const [descriptionDraft, setDescriptionDraft] = useState("");

    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isSavingDescription, setIsSavingDescription] = useState(false);

    const descriptionMessage = descriptionError || descriptionSuccess;
    const descriptionMessageType = descriptionError ? "error" : "success";


    //Sets the description to either the existing one or empty
    function startDescriptionEdit() {
        setDescriptionError("");
        setDescriptionSuccess("");

        setDescriptionDraft(
            organisationProfile?.description ?? ""
        );

        setIsEditingDescription(true);
    }

    //sets draft back to original or empty
    function handleCancelDescriptionEdit() {
        setDescriptionDraft(
            organisationProfile?.description ?? ""
        );

        setDescriptionError("");
        setIsEditingDescription(false);
    }

    //Open delete account menu
    function openDeleteAccountModal() {
        setIsAccountOptionsOpen(false);
        setShowDeleteAccountModal(true);
    }

    //Close delete account menu
    function closeDeleteAccountModal() {
        if (isDeletingAccount) {
            return;
        }

        setShowDeleteAccountModal(false);
    }

    function toggleAccountOptions() {
        setIsAccountOptionsOpen(
            (current) => !current
        );
    }

    //saves the users new description
    async function handleSaveDescription() {
        const trimmedDescription = descriptionDraft.trim();

        setDescriptionError("");
        setDescriptionSuccess("");

        if (!trimmedDescription) {
            setDescriptionError("Please enter a shelter description.");
            return;
        }

        if (trimmedDescription.length > 1000) {
            setDescriptionError("The shelter description cannot exceed 1000 characters.");

            return;
        }

        setIsSavingDescription(true);

        try {
            const updatedProfile = await updateOrganisationDescription(trimmedDescription);

            updateCachedOrganisationProfile({
                ...organisationProfile,
                ...updatedProfile,
                profileImageUrl:
                    organisationProfile?.profileImageUrl,
            });

            //refresh cache
            await refreshOrganisationProfile();

            setDescriptionDraft(updatedProfile.description ?? "");
            setIsEditingDescription(false);

            setDescriptionSuccess("Shelter description updated successfully.");
        } catch (error) {
            console.error("Unable to update shelter description:", error);

            setDescriptionError(
                error instanceof Error
                    ? error.message
                    : "Unable to update the shelter description."
            );
        } finally {
            setIsSavingDescription(false);
        }
    }

    async function handleDeleteAccount() {
        setIsDeletingAccount(true);

        try {
            //deletes all account info eg. pet listings, matching profile, s3 files, cognito user
            await deleteOrganisationAccount();

            setShowDeleteAccountModal(false);

            //clear the user cache
            clearCachedOrganisationProfile();
            await signOut();

            navigate(routes.auth.login, {
                replace: true
            });
        } catch (error) {
            console.error(
                "Unable to delete shelter account:",
                error
            );
        } finally {
            setIsDeletingAccount(false);
        }
    }

    useEffect(() => {
        document.title = "Settings | PetPath";

        if (!organisationProfile) {
            return;
        }

        if (organisationProfile.accountStatus === "pending") {
            navigate(routes.auth.accountReview,
                {
                    replace: true,
                }
            );

            return;
        }

        if (organisationProfile.accountStatus !== "approved") {
            navigate(
                routes.auth.login,
                {
                    replace: true,
                }
            );

            return;
        }

        if (!isEditingDescription) {
            setDescriptionDraft(organisationProfile.description ?? "");
        }
    }, [
        organisationProfile,
        organisationProfile?.description,
        isEditingDescription,
        navigate,
    ]);

    return {
        organisationProfile,
        isLoadingProfile,
        profileError,

        profileImagePreview,
        profileImageError,
        isUploadingProfileImage,
        changeProfileImage,

        descriptionDraft,
        setDescriptionDraft,
        isEditingDescription,
        isSavingDescription,
        descriptionMessage,
        descriptionMessageType,
        descriptionError,

        startDescriptionEdit,
        handleCancelDescriptionEdit,
        handleSaveDescription,

        isAccountOptionsOpen,
        showDeleteAccountModal,
        isDeletingAccount,
        toggleAccountOptions,
        openDeleteAccountModal,
        closeDeleteAccountModal,
        handleDeleteAccount,
    };
}
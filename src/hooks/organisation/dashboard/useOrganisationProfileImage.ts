import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    updateOrganisationProfileImage,
    type OrganisationProfile,
} from "../../../services/organisation/organisationService";

import { validateImageFile } from "../../../utils/imageValidation";

type UseOrganisationProfileImageProps = {
    organisationProfile: OrganisationProfile | null;

    updateCachedOrganisationProfile: (
        profile: OrganisationProfile
    ) => void;

    refreshOrganisationProfile: () =>
        Promise<OrganisationProfile | null>;
};

/**
 * This hook handles the changing of an user's profile picture.
 * It also updates the locally caches organisation profile after the upload
 * @param param0 
 * @returns 
 */
export function useOrganisationProfileImage({
    organisationProfile,
    updateCachedOrganisationProfile,
    refreshOrganisationProfile,
}: UseOrganisationProfileImageProps) {
    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
    const [profileImageError, setProfileImageError] = useState("");

    //Called when the user selects an image
    const changeProfileImage = useCallback(
        async (file: File) => {
            setProfileImageError("");

            //validate the image
            const validationError =
                validateImageFile(file, {
                    maxSizeMb: 5,
                });

            if (validationError) {
                setProfileImageError(
                    validationError
                );

                return;
            }

            //check there is a profile
            if (!organisationProfile) {
                setProfileImageError(
                    "Your organisation profile could not be loaded."
                );

                return;
            }

            //create local browser url for the selected file
            const temporaryPreviewUrl =
                URL.createObjectURL(file);

            setProfileImagePreview(
                temporaryPreviewUrl
            );

            setIsUploadingProfileImage(true);

            try {

                //upload profile pic
                const updatedProfile =
                    await updateOrganisationProfileImage(
                        file,
                        organisationProfile
                    );

                //update cached profile
                updateCachedOrganisationProfile(
                    updatedProfile
                );

                //fetch the newest profile from backend
                await refreshOrganisationProfile();

                //remove temp preview. We have the real backend image now
                setProfileImagePreview("");
            } catch (error) {
                console.error(
                    "Unable to update profile image:",
                    error
                );

                
                setProfileImagePreview("");

                setProfileImageError(
                    error instanceof Error
                        ? error.message
                        : "Unable to update the profile picture."
                );
            } finally {
                //releases temporary browser url from memory
                URL.revokeObjectURL(
                    temporaryPreviewUrl
                );

                setIsUploadingProfileImage(false);
            }
        },
        [
            organisationProfile,
            refreshOrganisationProfile,
            updateCachedOrganisationProfile,
        ]
    );

    /*
     * Cleanup. Removes any remaining temporary preview when the
     * component using this hook unmounts.
     */
    useEffect(() => {
        return () => {
            if (
                profileImagePreview.startsWith(
                    "blob:"
                )
            ) {
                URL.revokeObjectURL(
                    profileImagePreview
                );
            }
        };
    }, [profileImagePreview]);

    function clearProfileImageError() {
        setProfileImageError("");
    }

    return {
        profileImagePreview,
        profileImageError,
        isUploadingProfileImage,
        changeProfileImage,
        clearProfileImageError, //get rid of any errors
    };
}
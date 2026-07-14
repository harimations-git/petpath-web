import { useEffect, useState } from "react";

import { useOrganisationProfile } from "../../context/OrganisationProfileContext";
import { useOrganisationProfileImage } from "../../hooks/useOrganisationProfileImage";
import { updateOrganisationDescription } from "../../services/organisation/organisationService";

import { routes } from "../../constants/routes";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import { Building2, Mail, Pencil, ShieldCheck } from "lucide-react";

import "./MyListings.css";
import "./Settings.css";

import Card from "../../components/ui/Card";
import ProfilePictureCard from "../../components/ui/profile/ProfilePictureCard";
import Spacer from "../../components/layout/Spacer";



export default function Settings() {

    const navigate = useNavigate();
    const { organisationProfile, isLoadingProfile, profileError, updateCachedOrganisationProfile, refreshOrganisationProfile } = useOrganisationProfile();

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

    const [descriptionError, setDescriptionError] = useState("");
    const [descriptionSuccess, setDescriptionSuccess] = useState("");
    const [descriptionDraft, setDescriptionDraft] = useState("");

    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const descriptionMessage = descriptionError || descriptionSuccess;
    const descriptionMessageType = descriptionError ? "error" : "success";

    //resets description back to normal if user cancels
    function handleCancelDescriptionEdit() {
        setDescriptionDraft(
            organisationProfile?.description ?? ""
        );

        setIsEditingDescription(false);
    }

    //Format and save new description to database
    async function handleSaveDescription() {
        const trimmedDescription =
            descriptionDraft.trim();

        setDescriptionError("");
        setDescriptionSuccess("");

        if (!trimmedDescription) {
            setDescriptionError(
                "Please enter a shelter description."
            );

            return;
        }

        if (trimmedDescription.length > 500) {
            setDescriptionError(
                "The shelter description cannot exceed 500 characters."
            );

            return;
        }

        setIsSaving(true);

        try {
            //try updating the profile with new formatted description
            const updatedProfile =
                await updateOrganisationDescription(
                    trimmedDescription
                );

            //updated the cached profile to the newly updated profile
            updateCachedOrganisationProfile({
                ...organisationProfile,
                ...updatedProfile,
                profileImageUrl:
                    organisationProfile?.profileImageUrl,
            });

            //refresh the profile and the page
            await refreshOrganisationProfile();

            setDescriptionDraft(
                updatedProfile.description ?? ""
            );

            setIsEditingDescription(false);

            setDescriptionSuccess(
                "Shelter description updated successfully."
            );
        } catch (error) {
            console.error(
                "Unable to update shelter description:",
                error
            );

            setDescriptionError(
                error instanceof Error
                    ? error.message
                    : "Unable to update the shelter description."
            );
        } finally {
            setIsSaving(false);
            setIsEditingDescription(false);
        }
    }

    useEffect(() => {
        document.title = "Settings | PetPath";

        if (!organisationProfile) {
            return;
        }

        if (organisationProfile.accountStatus === "pending") {
            navigate(routes.auth.accountReview, {
                replace: true,
            });

            return;
        }

        if (
            organisationProfile.accountStatus !== "approved"
        ) {
            navigate(routes.auth.login, {
                replace: true,
            });
        }

        if (!isEditingDescription) {
            setDescriptionDraft(
                organisationProfile?.description ?? ""
            );
        }
    }, [organisationProfile, navigate,
        organisationProfile?.description,
        isEditingDescription,
    ]);

    if (isLoadingProfile) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading your shelter account..."
            />
        );
    }


    if (profileError) {
        return (
            <main className="dashboard-page">
                <p className="dashboard-error">
                    {profileError}
                </p>
            </main>
        );
    }

    return (
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>Settings</h1>

                    <p>
                        Manage your shelter account.
                    </p>
                </div>
            </header>

            <div className="settings-grid">
                <div className="settings-column">
                    <Card className="account-overview-card">
                        <div className="settings-card-heading">
                            <div className="settings-card-icon">
                                <Building2
                                    size={20}
                                />
                            </div>

                            <div>
                                <h2>Account overview</h2>
                                <p>View your shelter account details.</p>
                            </div>
                        </div>

                        <div className="account-detail-list">
                            <div className="account-details-inline">
                                <div className="account-detail-row">
                                    <span className="account-detail-label">
                                        Shelter name
                                    </span>

                                    <span className="account-detail-value">
                                        {organisationProfile?.charityName ??
                                            "Not available"}
                                    </span>
                                </div>

                                <div className="account-detail-row">
                                    <span className="account-detail-label">
                                        Charity / Organisation ID
                                    </span>

                                    <span className="account-detail-value">
                                        {organisationProfile?.charityId ??
                                            "Not available"}
                                    </span>
                                </div>
                            </div>

                            <div className="account-detail-row">
                                <span className="account-detail-label">
                                    Email address
                                </span>

                                <span className="account-detail-value">
                                    {organisationProfile?.email ??
                                        "Not available"}
                                </span>

                                <div className="password-list">
                                    <span className="password-label">
                                        Password
                                    </span>

                                    <div className="password-value-row">
                                        <span
                                            className="fake-password-value"

                                        >
                                            ************
                                        </span>

                                        <Link
                                            to={routes.auth.forgotPassword}
                                            state={{
                                                initialEmail:
                                                    organisationProfile?.email ?? "",
                                                returnTo: routes.home.settings,
                                            }}
                                            className="password-change-link"
                                        >
                                            Change password
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="account-verification-message">
                            <div className="account-verification-icon">
                                <ShieldCheck
                                    size={21}
                                />
                            </div>

                            <div>
                                <strong>Your account is verified</strong>

                                <p>
                                    Thank you for helping pets in need.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
                {isUploadingProfileImage ? (
                    <>
                        <Card className="profile-image-loading">
                            <LoadingSpinner
                                size="xl"
                                label="Uploading your profile picture..."
                            />
                        </Card>
                    </>
                ) : (
                    <ProfilePictureCard
                        imageUrl={
                            profileImagePreview ||
                            organisationProfile?.profileImageUrl
                        }
                        organisationName={
                            organisationProfile?.charityName
                        }
                        onChangeImage={changeProfileImage}
                        isDisabled={isUploadingProfileImage}
                    />

                )}

                {profileImageError && (
                    <p
                        className="profile-image-error"
                        role="alert"
                    >
                        {profileImageError}
                    </p>
                )}

                <Card className="account-overview-card public-details-card">
                    <div className="settings-card-heading">
                        <div className="settings-card-icon">
                            <Mail
                                size={20}
                            />
                        </div>

                        <div>
                            <h2>Public details</h2>

                            <p>
                                Manage the information shown to PetPath users.
                            </p>
                        </div>
                    </div>

                    <div className="public-details-website-row">
                        <div className="account-detail-column">
                            <span className="account-detail-label">
                                Website
                            </span>

                            {organisationProfile?.websiteUrl ? (
                                <a
                                    className="account-detail-value"
                                    href={
                                        organisationProfile.websiteUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {
                                        organisationProfile.websiteUrl
                                    }
                                </a>
                            ) : (
                                <span className="account-detail-value">
                                    Not available
                                </span>
                            )}
                        </div>

                        <div className="account-detail-column">
                            <span className="account-detail-label">
                                Website domain
                            </span>

                            <span className="account-detail-value">
                                {organisationProfile?.websiteDomain ??
                                    "Not available"}
                            </span>
                        </div>
                    </div>

                    <div className="public-description-section">
                        <div className="public-description-heading">
                            <div>
                                <label
                                    className="account-detail-label"
                                >
                                    Shelter description
                                </label>
                            </div>


                        </div>


                        {isEditingDescription ? (
                            <>
                                <textarea
                                    id="shelter-description"
                                    className="shelter-description-input"
                                    value={descriptionDraft}
                                    onChange={(event) =>
                                        setDescriptionDraft(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Tell adopters about your shelter..."
                                    maxLength={500}
                                />

                                <div className="description-edit-footer">
                                    <span>
                                        {descriptionDraft.length}/500
                                    </span>

                                    <div className="description-edit-actions">
                                        <button
                                            type="button"
                                            className="description-cancel-button"
                                            onClick={
                                                handleCancelDescriptionEdit
                                            }
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="description-save-button"
                                            onClick={
                                                handleSaveDescription
                                            }
                                            disabled={isSaving}
                                        >
                                            {!isSaving ? "Save Description" : "Saving..."}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="shelter-description-value">
                                {organisationProfile?.description ??
                                    "No shelter description has been added."}
                            </p>
                        )}

                        {descriptionMessage && (
                            <span
                                className={`account-detail-message account-detail-message--${descriptionMessageType}`}
                                role={descriptionError ? "alert" : "status"}
                            >
                                {descriptionMessage}
                            </span>
                        )}

                        {!isEditingDescription && (
                            <>
                                <Spacer height={10} />
                                <button
                                    type="button"
                                    className="description-edit-button"
                                    onClick={() => setIsEditingDescription(true)}
                                    disabled={isSaving}
                                >
                                    <Pencil
                                        size={14}
                                    />

                                    {!isSaving ? "Edit" : "Saving..."}
                                </button>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </main >
    );
}
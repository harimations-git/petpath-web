import { routes } from "../../../constants/routes";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

import { Building2, Mail, Pencil, ShieldCheck } from "lucide-react";

import "./MyListings.css";
import "./Settings.css";

import Card from "../../../components/ui/Card";
import ProfilePictureCard from "../../../components/ui/profile/ProfilePictureCard";
import Spacer from "../../../components/layout/Spacer";

import DeleteAccountOption from "../../../components/ui/profile/delete/DeleteAccountOption";
import { useSettings } from "../../../hooks/organisation/dashboard/useSettings";

/**
 * Displays the organisation settings page.
 * Allows organisations to view account information, update their public
 * profile details and delete their account.
 */
export default function Settings() {

    const {
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
    } = useSettings();

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
                    <div className="settings-heading-row">
                        <h1>Settings</h1>
                        <DeleteAccountOption
                            isOpen={isAccountOptionsOpen}
                            showDeleteModal={showDeleteAccountModal}
                            isDeleting={isDeletingAccount}
                            onToggle={toggleAccountOptions}
                            onOpenDeleteModal={openDeleteAccountModal}
                            onCloseDeleteModal={closeDeleteAccountModal}
                            onConfirmDelete={handleDeleteAccount}
                        />
                    </div>

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
                                        <span className="fake-password-value">
                                            ************
                                        </span>

                                        <Link
                                            to={routes.auth.forgotPassword}
                                            state={{
                                                initialEmail: organisationProfile?.email ?? "",
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
                        imageUrl={profileImagePreview || organisationProfile?.profileImageUrl}
                        organisationName={ organisationProfile?.charityName}
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
                                    href={organisationProfile.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    { organisationProfile.websiteUrl}
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
                                    onChange={(event) => setDescriptionDraft(event.target.value)}
                                    placeholder="Tell adopters about your shelter..."
                                    maxLength={1000}
                                />

                                <div className="description-edit-footer">
                                    <span>
                                        {descriptionDraft.length}/1000
                                    </span>

                                    <div className="description-edit-actions">
                                        <button
                                            type="button"
                                            className="description-cancel-button"
                                            onClick={handleCancelDescriptionEdit}
                                            disabled={isSavingDescription}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="description-save-button"
                                            onClick={handleSaveDescription}
                                            disabled={isSavingDescription}
                                        >
                                            {!isSavingDescription ? "Save Description" : "Saving..."}
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
                                    onClick={startDescriptionEdit}
                                    disabled={isSavingDescription}
                                >
                                    <Pencil size={14}/>

                                    {!isSavingDescription ? "Edit" : "Saving..."}
                                </button>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </main >
    );
}

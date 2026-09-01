import { useState } from "react";

import { ShieldAlert } from "lucide-react";

import Card from "../../../components/ui/Card";
import DecorativeLeaf from "../../../components/ui/decorative/DecorativeLeaf";
import InfoModal from "../../../components/ui/InfoModal";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

import { routes } from "../../../constants/routes";
import { useBackButtonRedirect } from "../../../hooks/organisation/dashboard/useBackButtonRedirect";

import "./ProfileSetup.css";
import Logo from "../../../components/ui/decorative/Logo";
import { useProfileSetup } from "../../../hooks/organisation/profile/useProfileSetup";
import ProfileSetupSidebar from "../../../components/ui/profile/setup/ProfileSetupSidebar";
import ProfileOnlineSection from "../../../components/ui/profile/setup/ProfileOnlineSection";
import ProfileAboutSection from "../../../components/ui/profile/setup/ProfileAboutSection";
import ProfileAddressSection from "../../../components/ui/profile/setup/ProfileAddressSection";
import ProfileSetupActions from "../../../components/ui/profile/setup/ProfileSetupActions";

/**
 * Displays the organisation profile setup page.
 * Collects the public profile information required before listing pets.
 */
export default function ProfileSetup() {
    useBackButtonRedirect(routes.home.dashboard);

    const [showMonitoringModal, setShowMonitoringModal] = useState(true);

    const {
        organisationProfile,

        websiteUrl,
        setWebsiteUrl,
        websiteDomain,

        description,
        setDescription,

        addressLine1,
        setAddressLine1,

        addressLine2,
        setAddressLine2,

        townCity,
        setTownCity,

        county,
        setCounty,

        postcode,
        setPostcode,

        country,
        setCountry,

        profileImagePreview,

        isLoading,
        isSaving,
        formError,

        handleProfileImageChange,
        handleSubmit,
    } = useProfileSetup();


    if (isLoading) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading your organisation..."
            />
        );
    }

    return (
        <main className="organisation-profile-setup-page">
            <DecorativeLeaf
                top={50}
                left={-45}
                rotate={70}
                width={260}
                height={260}
            />

            <DecorativeLeaf
                bottom={-70}
                right={-20}
                rotate={-90}
                flipX
                width={260}
                height={260}
            />

            <header className="organisation-profile-setup-header">
                <Logo
                    hasTagline
                    size="md"
                />

                <div>
                    <span>
                        Organisation onboarding
                    </span>

                    <h1>
                        Complete your profile
                    </h1>

                    <p>
                        This information will help
                        adopters understand who you
                        are and where your
                        organisation is based.
                    </p>
                </div>
            </header>

            <Card className="organisation-profile-setup-card">
                <form
                    className="organisation-profile-setup-form"
                    onSubmit={handleSubmit}
                >
                    <ProfileSetupSidebar
                        organisationProfile={organisationProfile}
                        profileImagePreview={profileImagePreview}
                        onImageChange={handleProfileImageChange}
                    />

                    <section className="organisation-profile-fields">

                        <ProfileOnlineSection
                            websiteUrl={websiteUrl}
                            websiteDomain={websiteDomain}
                            onWebsiteChange={setWebsiteUrl}
                        />

                        <ProfileAboutSection
                            description={description}
                            onDescriptionChange={setDescription}
                        />

                        <ProfileAddressSection
                            addressLine1={addressLine1}
                            addressLine2={addressLine2}
                            townCity={townCity}
                            county={county}
                            postcode={postcode}
                            country={country}

                            onAddressLine1Change={setAddressLine1}
                            onAddressLine2Change={setAddressLine2}
                            onTownCityChange={setTownCity}
                            onCountyChange={setCounty}
                            onPostcodeChange={setPostcode}
                            onCountryChange={setCountry}
                        />

                        <ProfileSetupActions
                            isSaving={isSaving}
                            error={formError}
                        />

                    </section>
                </form>
            </Card>

            <InfoModal
                visible={showMonitoringModal}
                title="Code of Conduct"
                message="Organisation profiles are monitored to help keep PetPath safe and trustworthy for all users."
                warning="Inappropriate, misleading or unsafe information may result in your account being permanently banned from PetPath."
                icon={ShieldAlert}
                buttonText="I understand"
                onClose={() => setShowMonitoringModal(false)}
                onConfirm={() => setShowMonitoringModal(false)}
            />
        </main>
    );
}
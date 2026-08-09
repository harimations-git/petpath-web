import { ArrowLeft, Building2, Trash2 } from "lucide-react";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/ui/Card";
import CustomButton from "../../../components/ui/CustomButton";
import InfoModal from "../../../components/ui/InfoModal";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

import AdminAccountMenu from "../../../components/ui/admin/profile/AdminAccountMenu";

import OrganisationProfileSummary from "../../../components/ui/admin/organisations/details/OrganisationProfileSummary";
import OrganisationAboutSection from "../../../components/ui/admin/organisations/details/OrganisationAboutSection";
import OrganisationInformationSection from "../../../components/ui/admin/organisations/details/OrganisationInformationSection";
import OrganisationLocationSection from "../../../components/ui/admin/organisations/details/OrganisationLocationSection";
import OrganisationWebsiteSection from "../../../components/ui/admin/organisations/details/OrganisationWebsiteSection";
import OrganisationAccountActions from "../../../components/ui/admin/organisations/details/OrganisationAccountActions";

import { useAdminOrganisationDetails } from "../../../hooks/admin/useAdminOrganisationDetails";
import { formatLocation } from "../../../utils/listings/displayFormatting";
import { routes } from "../../../constants/routes";

import "./ViewOrganisation.css";
import "../../organisation/dashboard/PageHeading.css";


export default function ViewOrganisation() {
    const navigate = useNavigate();

    const {organisationId} = useParams<{organisationId: string}>();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        organisation,

        isLoading,
        isDeleting,

        error,
        deleteError,

        retry,
        deleteOrganisation,
    } = useAdminOrganisationDetails(
        organisationId
    );

    //Navigate back to the all organisation page
    function goBack() {
        navigate(routes.admin.organisations.allOrganisations);
    }

    //Opens the delete info modal
    function openDeleteModal() {
        setShowDeleteModal(
            true
        );
    }

    //Closes the delete info modal
    function closeDeleteModal() {
        if (isDeleting) {
            return;
        }

        setShowDeleteModal(false);
    }

    //Sends api call to delete the organisation's account
    async function confirmDeletion() {
        const wasSuccessful = await deleteOrganisation();

        if (!wasSuccessful) {
            return;
        }

        setShowDeleteModal(false);
        goBack();
    }

    if (isLoading) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading organisation..."
            />
        );
    }

    if (error || !organisation) {
        return (
            <main className="page-body admin-organisation-details-page">
                <Card className="admin-organisation-details-error">
                    <Building2
                        size={36}
                    />

                    <h2>
                        Unable to load
                        organisation
                    </h2>

                    <p>
                        {error || "The organisation could not be found."}
                    </p>

                    <div className="admin-organisation-details-error-actions">
                        <CustomButton
                            label="Back to organisations"
                            icon={<ArrowLeft size={18}/>}
                            onClick={goBack}
                        />

                        <button
                            type="button"
                            onClick={() => void retry()}
                        >
                            Try again
                        </button>
                    </div>
                </Card>
            </main>
        );
    }

    //Joins each location field into a readable location
    const location =
        formatLocation([
            organisation.addressLineOne,
            organisation.addressLineTwo,
            organisation.townCity,
            organisation.postcode,
            organisation.locationCounty,
            organisation.locationCountry,
        ]);

    return (
        <main className="page-body admin-organisation-details-page">
            <header className="page-header">
                <div className="page-heading">
                    <h1>
                        {organisation.charityName}
                    </h1>

                    <p>
                        View organisation
                        information and account
                        details.
                    </p>
                </div>

                <div className="page-account-menu">
                    <AdminAccountMenu />
                </div>
            </header>


            <OrganisationProfileSummary
                organisationName={organisation.charityName}
                profileImageUrl={organisation.profileImageUrl}
                createdAt={organisation.createdAt}
            />


            <div className="admin-organisation-details-sections">
                <OrganisationAboutSection
                    description={organisation.description}
                />

                <OrganisationInformationSection
                    charityName={organisation.charityName}
                    charityId={organisation.charityId}
                    email={organisation.email}
                    createdAt={organisation.createdAt}
                    reviewedAt={organisation.reviewedAt}
                />

                <OrganisationLocationSection
                    location={location}
                />

                <OrganisationWebsiteSection
                    websiteUrl={organisation.websiteUrl}
                />

                <OrganisationAccountActions
                    isDeleting={ isDeleting}
                    onDelete={openDeleteModal}
                />

                {deleteError && (
                    <p className="admin-organisation-delete-error">
                        {deleteError}
                    </p>
                )}
            </div>

            <InfoModal
                visible={ showDeleteModal}
                title="Delete organisation account?"
                message={`Are you sure you want to permanently delete "${organisation.charityName}"?`}
                warning="This action cannot be undone. The organisation account will be permanently removed."
                icon={Trash2}
                buttonText={isDeleting ? "Deleting..." : "Delete account"}
                buttonTextSecondary="Cancel"
                isLoading={isDeleting}
                closeOnBackdrop={!isDeleting}
                primaryButtonStyle={{background: "var(--color-error)"}}
                onClose={closeDeleteModal}
                onConfirm={confirmDeletion}
            />
        </main>
    );
}
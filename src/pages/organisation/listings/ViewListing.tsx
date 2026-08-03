import { useParams } from "react-router-dom";
import { Save, Shield } from "lucide-react";

import ListingBasicsSection from "../../../components/ui/listings/create/ListingBasicsSection";
import AnimalDetailsSection from "../../../components/ui/listings/create/AnimalDetailsSection";
import HealthCareSection from "../../../components/ui/listings/create/HealthCareSection";

import ListingPhotoUpload from "../../../components/ui/listings/ListingPhotoUpload";
import MatchingProfileSection from "../../../components/ui/listings/MatchingProfileSelection";

import OrganisationAccountMenu from "../../../components/ui/profile/OrganisationAccountMenu";
import CustomButton from "../../../components/ui/CustomButton";
import InfoModal from "../../../components/ui/InfoModal";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";



import "../dashboard/CreateListing.css";
import "../dashboard/PageHeading.css";
import DeleteListingOption from "../../../components/ui/listings/delete/DeleteListingOption";
import { useViewListing } from "../../../hooks/organisation/dashboard/useViewListing";


export default function ViewListing() {
    //get listing id from search params
    const { listingId } = useParams<{ listingId: string; }>();
    //pass it to the hook to get the details to prefill the form
    const form = useViewListing(listingId);

    if (form.isLoadingListing) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading listing..."
            />
        );
    }

    if (form.listingError) {
        return (
            <main className="page-body">
                <p className="create-listing-error">
                    {form.listingError}
                </p>
            </main>
        );
    }

    return (
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>{form.listingTitle} Listing</h1>

                    <p>
                        Update this pet listing and
                        submit any changes for review.
                    </p>
                </div>

                <div className="page-header-controls">
                    <DeleteListingOption
                        isOpen={form.isDeleteListingOptionOpen}
                        showDeleteModal={form.showDeleteListingModal}
                        isDeleting={form.isDeletingListing}
                        onToggle={form.toggleListingOptions}
                        onOpenDeleteModal={form.openDeleteListingModal}
                        onCloseDeleteModal={form.closeDeleteListingModal}
                        onConfirmDelete={form.handleDeleteListing}
                    />

                    <OrganisationAccountMenu />
                </div>
            </header>

            <form
                className="create-listing-form"
                onSubmit={form.handleSubmit}
            >
                <ListingBasicsSection
                    listingTitle={
                        form.listingTitle
                    }
                    onListingTitleChange={
                        form.setListingTitle
                    }
                    listingType={
                        form.listingType
                    }
                    onListingTypeChange={
                        form.handleListingTypeChange
                    }
                    listingAnimalType={
                        form.listingAnimalType
                    }
                    onAnimalTypeChange={
                        form.setListingAnimalType
                    }
                    numberOfAnimals={
                        form.numberOfAnimals
                    }
                    onNumberOfAnimalsChange={
                        form.handleNumberOfAnimalsChange
                    }
                    description={
                        form.description
                    }
                    onDescriptionChange={
                        form.setDescription
                    }
                    listingUrl={
                        form.listingUrl
                    }
                    onListingUrlChange={
                        form.setListingUrl
                    }
                    listingUrlMatchesOrganisation={
                        form.listingUrlMatchesOrganisation
                    }
                    organisationDomain={
                        form.organisationDomain
                    }
                    adoptionFee={
                        form.adoptionFee
                    }
                    onAdoptionFeeChange={
                        form.handleAdoptionFeeChange
                    }
                    organisationLocation={
                        form.organisationLocation
                    }
                />

                <ListingPhotoUpload
                    photos={form.listingPhotos}
                    onChange={form.setListingPhotos}
                    existingPhotos={form.existingPhotos}
                    onRemoveExistingPhoto={form.removeExistingPhoto}
                    sectionNumber={2}
                    maxPhotos={5}
                    maxFileSizeMb={10}
                />

                <AnimalDetailsSection
                    animals={form.animals}
                    listingType={form.listingType
                    }
                    onAnimalChange={
                        form.updateAnimal
                    }
                />

                <MatchingProfileSection
                    value={
                        form.matchingProfile
                    }
                    onChange={
                        form.setMatchingProfile
                    }
                    sectionNumber={4}
                />

                <HealthCareSection
                    vaccinationStatus={
                        form.vaccinationStatus
                    }
                    microchipStatus={
                        form.microchipStatus
                    }
                    neuteredStatus={
                        form.neuteredStatus
                    }
                    healthNotes={
                        form.healthNotes
                    }
                    documents={
                        form.veterinaryDocuments
                    }
                    existingDocuments={
                        form.existingDocuments
                    }
                    onRemoveExistingDocument={
                        form.removeExistingDocument
                    }
                    onVaccinationChange={
                        form.setVaccinationStatus
                    }
                    onMicrochipChange={
                        form.setMicrochipStatus
                    }
                    onNeuteredChange={
                        form.setNeuteredStatus
                    }
                    onHealthNotesChange={
                        form.setHealthNotes
                    }
                    onDocumentsChange={
                        form.setVeterinaryDocuments
                    }
                />

                {form.formError && (
                    <p className="create-listing-error">
                        {form.formError}
                    </p>
                )}

                <CustomButton
                    label={
                        form.isSubmitting
                            ? "Saving changes..."
                            : "Save changes"
                    }
                    icon={
                        form.isSubmitting
                            ? undefined
                            : <Save size={22} />
                    }
                    type="submit"
                    className="create-listing-continue"
                    disabled={
                        form.isSubmitting
                    }
                />
            </form>

            <InfoModal
                visible={form.showModal}
                title="Listing updated"
                message="Your changes have been saved! The listing is now being reviewed by our PetPath team before it appears publicly."
                icon={Shield}
                buttonText="Continue"
                onClose={
                    form.handleModalContinue
                }
                onConfirm={
                    form.handleModalContinue
                }
            />
        </main>
    );
}
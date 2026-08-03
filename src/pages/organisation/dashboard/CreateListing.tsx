import ListingBasicsSection from "../../../components/ui/listings/create/ListingBasicsSection";
import AnimalDetailsSection from "../../../components/ui/listings/create/AnimalDetailsSection";
import HealthCareSection from "../../../components/ui/listings/create/HealthCareSection";

import ListingPhotoUpload from "../../../components/ui/listings/ListingPhotoUpload";
import MatchingProfileSection from "../../../components/ui/listings/MatchingProfileSelection";

import OrganisationAccountMenu from "../../../components/ui/profile/OrganisationAccountMenu";
import CustomButton from "../../../components/ui/CustomButton";
import InfoModal from "../../../components/ui/InfoModal";

import {
    useCreateListing,
} from "../../../hooks/organisation/dashboard/useCreateListing";

import "./CreateListing.css";
import "./PageHeading.css";

import {
    Send,
    Shield,
} from "lucide-react";

export default function CreateListing() {
    const form = useCreateListing();

    return (
        <main className="page-body">
            <header className="page-header">
                <div className="page-heading">
                    <h1>Create Listing</h1>

                    <p>
                        Add a new pet listing for
                        adopters to discover.
                    </p>
                </div>

                <div className="page-account-menu">
                    <OrganisationAccountMenu />
                </div>
            </header>

            <form
                className="create-listing-form"
                onSubmit={
                    form.handleSubmit
                }
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
                    photos={
                        form.listingPhotos
                    }
                    onChange={
                        form.setListingPhotos
                    }
                    sectionNumber={2}
                    maxPhotos={5}
                    maxFileSizeMb={10}
                />

                <AnimalDetailsSection
                    animals={form.animals}
                    listingType={
                        form.listingType
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
                    microchipStatus={ form.microchipStatus
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
                            ? "Submitting listing..."
                            : "Submit for review"
                    }
                    icon={
                        form.isSubmitting
                            ? undefined
                            : <Send size={22} />
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
                title="Review"
                message="Your listing will now be reviewed by our team before it goes live."
                warning="You can view this listings current status from the review updates page."
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
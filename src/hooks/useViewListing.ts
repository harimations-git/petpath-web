import {
    useEffect,
    useState,
    type SubmitEvent,
} from "react";

import { useNavigate } from "react-router-dom";
import { useCreateListing } from "./useCreateListing";

import {
    deleteOrganisationListing,
    getOrganisationListing,
    updateOrganisationListing,
} from "../services/listings/listingService";

import { useOrganisationListings } from "../context/OrganisationListingsContext";
import { routes } from "../constants/routes";
import type { ExistingListingDocument, ExistingListingPhoto} from "../types/listing";

/**
 * Hook containing the logic used for the View listing page
 * @param listingId 
 * @returns 
 */
export function useViewListing(listingId?: string) {
    const navigate = useNavigate();
    const form = useCreateListing();

    const {refreshListings, refreshReviewUpdates} = useOrganisationListings();

    const [isLoadingListing, setIsLoadingListing] = useState(true);
    const [listingError, setListingError] = useState("");
    const [editFormError, setEditFormError] = useState("");

    const [isSavingChanges, setIsSavingChanges] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [existingPhotos, setExistingPhotos] = useState<ExistingListingPhoto[]>([]);
    const [removedPhotoKeys, setRemovedPhotoKeys] = useState<string[]>([]);
    const [existingDocuments, setExistingDocuments] = useState<ExistingListingDocument[]>([]);

    //delete controls
    const [removedDocumentKeys, setRemovedDocumentKeys] = useState<string[]>([]);
    const [isDeleteListingOptionOpen, setIsDeleteListingOptionOpen] = useState(false);
    const [showDeleteListingModal, setShowDeleteListingModal] = useState(false);
    const [isDeletingListing, setIsDeletingListing] = useState(false);

    useEffect(() => {
        document.title = "View Listing | PetPath"
    })

    //auto fills the pet listing form from real data
    useEffect(() => {
        let cancelled = false;

        //get listing
        async function loadListing() {
            if (!listingId) {
                setListingError(
                    "Missing listing ID."
                );
                setIsLoadingListing(false);
                return;
            }

            setIsLoadingListing(true);
            setListingError("");

            try {
                //load listing
                const listing = await getOrganisationListing(listingId);

                //if user leaves the page, cancel it
                if (cancelled) {
                    return;
                }

                //listing fields
                form.setListingTitle(listing.title ?? "");

                form.handleListingTypeChange(listing.listingType);
                form.setListingAnimalType(listing.animalType);
                form.handleNumberOfAnimalsChange(listing.numberOfAnimals ?? 1);

                form.setDescription(listing.description ?? "");
                form.setListingUrl(listing.enquiryUrl ?? "");

                form.handleAdoptionFeeChange(String(listing.adoptionFee ?? 0));
                form.setAnimals(listing.animals ?? []);
                form.setMatchingProfile(listing.matchingProfile);

                form.setVaccinationStatus(listing.vaccinationStatus ?? "");
                form.setMicrochipStatus(listing.microchipStatus ?? "");
                form.setNeuteredStatus(listing.neuteredStatus ?? "");
                form.setHealthNotes(listing.healthNotes ?? "");

                setExistingPhotos(listing.photos ?? []);
                setExistingDocuments(listing.documents ?? []);

            } catch (error) {
                setListingError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load listing."
                );
            } finally {
                if (!cancelled) {
                    setIsLoadingListing(false);
                }
            }
        }

        //this starts the async function
        void loadListing();

        //cleanup
        return () => {
            cancelled = true;
        };
    }, [listingId]);


    //removes one of the original photos
    function removeExistingPhoto(
        photoKey: string
    ) {
        //removes the photo from the visible existing photo list
        setExistingPhotos(
            (currentPhotos) =>
                currentPhotos.filter(
                    (photo) =>
                        photo.key !== photoKey
                )
        );

        //add the photo's s3 key to the removed key array
        setRemovedPhotoKeys(
            (currentKeys) =>
                currentKeys.includes(photoKey) //prevents the same key from being added more than once
                    ? currentKeys
                    : [
                        ...currentKeys,
                        photoKey,
                    ]
        );
    }

    //same as setRemovedPhotoKeys but for documents
    function removeExistingDocument(
        documentKey: string
    ) {
        setExistingDocuments(
            (currentDocuments) =>
                currentDocuments.filter(
                    (document) =>
                        document.key !==
                        documentKey
                )
        );

        setRemovedDocumentKeys(
            (currentKeys) =>
                currentKeys.includes(
                    documentKey
                )
                    ? currentKeys
                    : [
                        ...currentKeys,
                        documentKey,
                    ]
        );
    }

    //save the edited listing
    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!listingId) {
            setEditFormError("Missing listing ID.");
            return;
        }

        setEditFormError("");
        setIsSavingChanges(true);

        try {
            await updateOrganisationListing({
                listingId,
                title: form.listingTitle,

                listingType: form.listingType,
                animalType: form.listingAnimalType,
                numberOfAnimals: Number(form.numberOfAnimals),

                description: form.description,
                listingUrl: form.listingUrl,
                adoptionFee: Number(form.adoptionFee),

                animals: form.animals,
                matchingProfile: form.matchingProfile,

                vaccinationStatus: form.vaccinationStatus,
                microchipStatus: form.microchipStatus,
                neuteredStatus: form.neuteredStatus,
                healthNotes: form.healthNotes,

                existingPhotoKeys: existingPhotos.map((photo) => photo.key),
                removedPhotoKeys,
                newPhotos: form.listingPhotos,

                existingDocumentKeys:
                    existingDocuments.map(
                        (document) =>
                            document.key
                    ),
                removedDocumentKeys,
                newDocuments: form.veterinaryDocuments,
            });

            //refresh the cache
            await refreshListings();
            await refreshReviewUpdates();

            setShowModal(true);
        } catch (error) {
            setEditFormError(
                error instanceof Error
                    ? error.message
                    : "Unable to save listing changes."
            );
        } finally {
            setIsSavingChanges(false);
        }
    }

    //handles the modal continue
    function handleModalContinue() {
        setShowModal(false);

        navigate(
            routes.home.status
        );
    }
    //open and closing delete controls
    function toggleListingOptions() {
        setIsDeleteListingOptionOpen(
            (current) => !current
        );
    }

    function openDeleteListingModal() {
        setIsDeleteListingOptionOpen(false);
        setShowDeleteListingModal(true);
    }

    function closeDeleteListingModal() {
        if (isDeletingListing) {
            return;
        }

        setShowDeleteListingModal(false);
    }

    //handle delete listing
    async function handleDeleteListing() {
        if (!listingId) {
            setEditFormError("Missing listing ID.");
            return;
        }

        setIsDeletingListing(true);
        setEditFormError("");

        try {

            //api call made
            await deleteOrganisationListing(listingId);
            setShowDeleteListingModal(false);

            //refresh cache
            await refreshListings();

            //re-route
            navigate(routes.home.myListings);

        } catch (error) {
            setEditFormError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete this listing."
            );
        } finally {
            //close modal
            setIsDeletingListing(false);
        }
    }

    return {
        ...form,

        isLoadingListing,
        listingError,

        existingPhotos,
        existingDocuments,

        removedPhotoKeys,
        removedDocumentKeys,

        removeExistingPhoto,
        removeExistingDocument,

        isSubmitting: isSavingChanges,
        formError: editFormError || form.formError,

        showModal,
        handleSubmit,
        handleModalContinue,

        isDeleteListingOptionOpen,
        showDeleteListingModal,
        isDeletingListing,
        toggleListingOptions,
        openDeleteListingModal,
        closeDeleteListingModal,
        handleDeleteListing,
    };
}
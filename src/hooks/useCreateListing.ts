import {
    useMemo,
    useState,
    type SubmitEvent,
} from "react";

import { useNavigate } from "react-router-dom";
import { useApprovedOrganisationRoute } from "./useApprovedOrganisationRoute";
import { useOrganisationListings } from "../context/OrganisationListingsContext";

import {
    createFileMetadata,
    createPetListing,
    prepareListingUploads,
    uploadPreparedListingFiles,
} from "../services/listings/listingService";

import { createEmptyAnimal } from "../utils/listings/createEmptyAnimal";
import { getDomainFromUrl, normaliseUrl } from "../utils/listings/listingUrlUtils";
import { routes } from "../constants/routes";

import type {
    AnimalSex,
    AnimalType,
    CreatePetListingRequest,
    ListingAnimalCategory,
    ListingAnimalForm,
    ListingType,
} from "../types/listing";

import type { MatchingProfileForm } from "../types/matchingProfile";
import type { MicrochipStatus, NeuteredStatus, VaccinationStatus } from "../types/vetInformation";

const initialMatchingProfile:
    MatchingProfileForm = {
    petCost: "",
    spaceNeeded: "",
    experienceNeeded: "",
    activityNeeded: "",
    attentionNeeded: "",
    homeType: "",
};


export function useCreateListing() {
    const navigate = useNavigate();

    const {
        organisationProfile,
        isLoadingProfile,
        profileError,
    } = useApprovedOrganisationRoute(
        "Create Listing | PetPath"
    );

    const {
        refreshReviewUpdates
    } = useOrganisationListings()

    const { refreshListings } = useOrganisationListings();

    const [listingTitle, setListingTitle] = useState("");
    const [listingType, setListingType] = useState<ListingType>("individual");
    const [listingAnimalType, setListingAnimalType] = useState<ListingAnimalCategory>("dog");

    const [description, setDescription] = useState("");
    const [listingUrl, setListingUrl] = useState("");

    const [adoptionFee, setAdoptionFee] = useState("");

    const [numberOfAnimals, setNumberOfAnimals] = useState(1);
    const [animals, setAnimals] = useState<ListingAnimalForm[]>([createEmptyAnimal()]);

    const [
        listingPhotos,
        setListingPhotos,
    ] = useState<File[]>([]);

    const [matchingProfile, setMatchingProfile] = useState<MatchingProfileForm>(initialMatchingProfile);

    const [vaccinationStatus, setVaccinationStatus] = useState<VaccinationStatus>("");
    const [microchipStatus, setMicrochipStatus] = useState<MicrochipStatus>("");
    const [neuteredStatus, setNeuteredStatus] = useState<NeuteredStatus>("");
    const [healthNotes, setHealthNotes] = useState("");
    const [veterinaryDocuments, setVeterinaryDocuments] = useState<File[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const organisationLocation =
        useMemo(() => {
            return [
                organisationProfile?.townCity,
                organisationProfile?.county,
                organisationProfile?.postcode,
                organisationProfile?.country,
            ]
                .filter(Boolean)
                .join(", ");
        }, [
            organisationProfile,
        ]);


    const organisationDomain =
        useMemo(() => {
            return getDomainFromUrl(
                organisationProfile
                    ?.websiteDomain ??
                organisationProfile
                    ?.websiteUrl ??
                ""
            );
        }, [
            organisationProfile
                ?.websiteDomain,
            organisationProfile
                ?.websiteUrl,
        ]);


    const listingUrlDomain =
        useMemo(() => {
            return getDomainFromUrl(
                listingUrl
            );
        }, [listingUrl]);


    const listingUrlMatchesOrganisation =
        Boolean(organisationDomain) &&
        Boolean(listingUrlDomain) &&
        organisationDomain ===
        listingUrlDomain;


    const matchingProfileComplete =
        Boolean(
            matchingProfile.petCost &&
            matchingProfile.spaceNeeded &&
            matchingProfile.experienceNeeded &&
            matchingProfile.activityNeeded &&
            matchingProfile.attentionNeeded &&
            matchingProfile.homeType
        );


    const healthProfileComplete =
        Boolean(vaccinationStatus) &&
        Boolean(microchipStatus) &&
        Boolean(neuteredStatus) &&
        veterinaryDocuments.length > 0;


    function handleListingTypeChange(
        newListingType: ListingType
    ) {
        setListingType(newListingType);
        setFormError("");

        if (
            newListingType ===
            "individual"
        ) {
            setNumberOfAnimals(1);

            /*
             * Mixed is only valid for
             * group listings.
             */
            if (
                listingAnimalType ===
                "mixed"
            ) {
                setListingAnimalType(
                    "dog"
                );
            }

            setAnimals(
                (currentAnimals) => {
                    if (
                        currentAnimals.length >
                        0
                    ) {
                        return [
                            currentAnimals[0],
                        ];
                    }

                    return [
                        createEmptyAnimal(),
                    ];
                }
            );

            return;
        }

        setNumberOfAnimals(2);

        setAnimals(
            (currentAnimals) => {
                if (currentAnimals.length >= 2) {
                    return currentAnimals;
                }

                return [
                    ...currentAnimals,
                    createEmptyAnimal(),
                ];
            }
        );
    }


    function handleNumberOfAnimalsChange(
        requestedNumber: number
    ) {
        const safeNumber = Math.min(4, Math.max(2, requestedNumber)
        );

        setNumberOfAnimals(
            safeNumber
        );

        setAnimals(
            (currentAnimals) => {
                if (
                    currentAnimals.length ===
                    safeNumber
                ) {
                    return currentAnimals;
                }

                if (
                    currentAnimals.length >
                    safeNumber
                ) {
                    return currentAnimals.slice(
                        0,
                        safeNumber
                    );
                }

                const animalsToAdd =
                    Array.from(
                        {
                            length:
                                safeNumber -
                                currentAnimals.length,
                        },
                        () =>
                            createEmptyAnimal()
                    );

                return [
                    ...currentAnimals,
                    ...animalsToAdd,
                ];
            }
        );
    }

    function updateAnimal(
        animalId: string,
        field: keyof ListingAnimalForm,
        value: string
    ) {
        setAnimals(
            (currentAnimals) =>
                currentAnimals.map(
                    (animal) =>
                        animal.id ===
                            animalId
                            ? {
                                ...animal,
                                [field]:
                                    value,
                            }
                            : animal
                )
        );
    }


    function handleAdoptionFeeChange(
        value: string
    ) {
        const numbersOnly = value
            .replace(/\D/g, "")

        setAdoptionFee(
            numbersOnly
        );
    }


    function validateForm() {
        if (!listingTitle.trim()) {
            return "Please enter a listing title.";
        }

        if (!description.trim()) {
            return "Please enter a listing description.";
        }

        if (!listingUrl.trim()) {
            return "Please enter the listing URL.";
        }

        if (!listingUrlMatchesOrganisation) {
            return organisationDomain
                ? `The listing URL must use ${organisationDomain}.`
                : "Your organisation must have a valid website domain.";
        }

        const fee = Number(adoptionFee);

        if (
            adoptionFee.trim() === "" ||
            Number.isNaN(fee) ||
            fee < 10 ||
            fee > 1000
        ) {
            return "Please enter an adoption fee between £10 and £1000.";
        }

        if (!organisationProfile?.townCity) {
            return "Your organisation profile must contain a location.";
        }

        if (listingPhotos.length === 0) {
            return "Please upload at least one listing photo.";
        }

        const incompleteAnimal =
            animals.find((animal) => {
                return (
                    !animal.name.trim() ||
                    !animal.animalType ||
                    !animal.sex ||
                    !animal.ageText.trim() ||
                    !animal.breedSpecies.trim()
                );
            });

        if (incompleteAnimal) {
            return "Please complete the required details for every animal.";
        }

        if (!matchingProfileComplete) {
            return "Please complete every matching profile field.";
        }

        if (!healthProfileComplete) {
            return "Please complete every question in the Health & Care section.";
        }

        return "";
    }


    function buildListingRequest(
        listingId: string,
        preparedPhotos:
            CreatePetListingRequest["photos"],
        preparedDocuments:
            CreatePetListingRequest["veterinaryDocuments"]
    ): CreatePetListingRequest {
        return {
            listingId,

            title: listingTitle.trim(),
            listingType,
            animalType: listingAnimalType,

            numberOfAnimals:
                listingType === "group"
                    ? numberOfAnimals
                    : 1,

            description: description.trim(),

            enquiryUrl:
                normaliseUrl(
                    listingUrl
                ),

            adoptionFee: Number(adoptionFee),

            vaccinationStatus,
            microchipStatus,
            neuteredStatus,

            healthNotes: healthNotes.trim(),

            photos: preparedPhotos,
            veterinaryDocuments: preparedDocuments,

            matchingProfile: {
                ...matchingProfile,
            },

            animals:
                animals.map(
                    (
                        animal,
                        index
                    ) => ({
                        animalId: animal.id,
                        name: animal.name.trim(),

                        animalType: animal.animalType as AnimalType,
                        breedSpecies: animal.breedSpecies.trim(),
                        sex: animal.sex as AnimalSex,

                        ageText: animal.ageText.trim(),
                        temperament: animal.temperament.trim(),
                        animalOrder: index + 1,
                    })
                ),
        };
    }


    async function handleSubmit(
        event:
            SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const validationError =
            validateForm();

        if (validationError) {
            setFormError(
                validationError
            );

            return;
        }

        setFormError("");
        setIsSubmitting(true);

        try {
            /*
             * Request temporary upload URLs
             * and a new listing ID.
             */
            const preparedUploads =
                await prepareListingUploads({
                    photos:
                        createFileMetadata(
                            listingPhotos
                        ),

                    documents:
                        createFileMetadata(
                            veterinaryDocuments
                        ),
                });

            /*
             * Upload the selected files
             * directly to S3.
             */
            await uploadPreparedListingFiles({
                listingPhotos,
                veterinaryDocuments,
                preparedUploads,
            });

            const preparedPhotos =
                preparedUploads.photos.map(
                    (
                        photo,
                        index
                    ) => ({
                        key: photo.key,
                        fileName: photo.fileName,

                        contentType: photo.contentType,
                        sizeBytes: photo.sizeBytes,
                        photoOrder: index + 1,
                    })
                );

            const preparedDocuments =
                preparedUploads.documents.map(
                    (document) => ({
                        key: document.key,
                        fileName: document.fileName,

                        contentType: document.contentType,
                        sizeBytes: document.sizeBytes,
                    })
                );

            const listingRequest =
                buildListingRequest(
                    preparedUploads.listingId,
                    preparedPhotos,
                    preparedDocuments
                );

            await createPetListing(
                listingRequest
            );

            /*
             * Refresh the shared cache so the
             * new pending listing appears.
             */
            await refreshListings();
            await refreshReviewUpdates();

            setShowModal(true);
        } catch (error) {
            console.error(
                "Unable to create pet listing:",
                error
            );

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Unable to create the pet listing."
            );
        } finally {
            setIsSubmitting(false);
        }
    }


    function handleModalContinue() {
        setShowModal(false);

        navigate(
            routes.home.status
        );
    }


    return {
        organisationProfile,
        isLoadingProfile,
        profileError,

        listingTitle,
        setListingTitle,

        listingType,
        handleListingTypeChange,

        listingAnimalType,
        setListingAnimalType,

        numberOfAnimals,
        handleNumberOfAnimalsChange,

        description,
        setDescription,

        listingUrl,
        setListingUrl,
        listingUrlMatchesOrganisation,
        organisationDomain,

        adoptionFee,
        handleAdoptionFeeChange,

        organisationLocation,

        animals,
        updateAnimal,
        setAnimals,

        listingPhotos,
        setListingPhotos,

        matchingProfile,
        setMatchingProfile,

        vaccinationStatus,
        setVaccinationStatus,

        microchipStatus,
        setMicrochipStatus,

        neuteredStatus,
        setNeuteredStatus,

        healthNotes,
        setHealthNotes,

        veterinaryDocuments,
        setVeterinaryDocuments,

        isSubmitting,
        formError,
        showModal,

        handleSubmit,
        handleModalContinue,
    };
}
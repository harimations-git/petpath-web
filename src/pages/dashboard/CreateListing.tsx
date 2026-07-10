import {
    useMemo,
    useState,
    type SubmitEvent,
} from "react";

import {
    Heart,
    Lock,
    Send,
    Shield,
    ShieldAlertIcon,
    UserRound,
    UsersRound,
} from "lucide-react";

import {
    useOrganisationProfile,
} from "../../context/OrganisationProfileContext";

import {
    animalSexOptions,
    individualAnimalTypeOptions,
    listingAnimalTypeOptions,
} from "../../data/listingOptions";

import type {
    AnimalSex,
    AnimalType,
    CreateListingInput,
    ListingAnimalCategory,
    ListingAnimalForm,
    ListingType,
} from "../../types/listing";



import type { VaccinationStatus, MicrochipStatus, NeuteredStatus } from "../../types/vetInformation";

import "./CreateListing.css";
import ListingPhotoUpload from "../../components/ui/listings/ListingPhotoUpload";
import VeterinaryDocumentUpload from "../../components/ui/listings/VeterinaryDocumentUpload";

import type {
    MatchingProfileForm,
} from "../../types/matchingProfile";

import MatchingProfileSection from "../../components/ui/listings/MatchingProfileSelection";
import CustomButton from "../../components/ui/CustomButton";
import InfoModal from "../../components/ui/InfoModal";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

function createEmptyAnimal(): ListingAnimalForm {
    return {
        id: crypto.randomUUID(),
        name: "",
        animalType: "",
        breedSpecies: "",
        sex: "",
        ageText: "",
        temperament: "",
    };
}

export default function CreateListing() {

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const {
        organisationProfile,
    } = useOrganisationProfile();

    const [listingTitle, setListingTitle] =
        useState("");

    const [listingType, setListingType] =
        useState<ListingType>("individual");

    const [
        listingAnimalType,
        setListingAnimalType,
    ] = useState<ListingAnimalCategory>("dog");

    const [numberOfAnimals, setNumberOfAnimals] =
        useState(1);

    const [description, setDescription] =
        useState("");

    const [animals, setAnimals] =
        useState<ListingAnimalForm[]>([
            createEmptyAnimal(),
        ]);

    const [
        listingPhotos,
        setListingPhotos,
    ] = useState<File[]>([]);

    const [formError, setFormError] =
        useState("");

    const organisationLocation = useMemo(() => {
        return [
            organisationProfile?.townCity,
            organisationProfile?.county,
            organisationProfile?.postcode,
            organisationProfile?.country,
        ]
            .filter(Boolean)
            .join(", ");
    }, [organisationProfile]);

    const [listingUrl, setListingUrl] = useState("");

    const [
        vaccinationStatus,
        setVaccinationStatus,
    ] = useState<VaccinationStatus>("");

    const [
        microchipStatus,
        setMicrochipStatus,
    ] = useState<MicrochipStatus>("");

    const [
        neuteredStatus,
        setNeuteredStatus,
    ] = useState<NeuteredStatus>("");

    const [healthNotes, setHealthNotes] =
        useState("");

    const [
        veterinaryDocuments,
        setVeterinaryDocuments,
    ] = useState<File[]>([]);

    const [
        matchingProfile,
        setMatchingProfile,
    ] = useState<MatchingProfileForm>({
        petCost: "",
        spaceNeeded: "",
        experienceNeeded: "",
        activityNeeded: "",
        attentionNeeded: "",
        homeType: "",
    });

    //Validation

    const healthProfileComplete =
        vaccinationStatus &&
        microchipStatus &&
        neuteredStatus &&
        veterinaryDocuments;

    const matchingProfileComplete =
        matchingProfile.petCost &&
        matchingProfile.spaceNeeded &&
        matchingProfile.experienceNeeded &&
        matchingProfile.activityNeeded &&
        matchingProfile.attentionNeeded &&
        matchingProfile.homeType;

    function getDomainFromUrl(value: string) {
        if (!value.trim()) {
            return "";
        }

        try {
            const formattedUrl =
                value.startsWith("http://") ||
                    value.startsWith("https://")
                    ? value
                    : `https://${value}`;

            return new URL(formattedUrl)
                .hostname
                .toLowerCase()
                .replace(/^www\./, "");
        } catch {
            return "";
        }
    }

    const organisationDomain = useMemo(
        () => getDomainFromUrl(organisationProfile?.websiteDomain ?? ""),
        [organisationProfile?.websiteDomain]
    );

    const listingUrlDomain = useMemo(
        () => getDomainFromUrl(listingUrl),
        [listingUrl]
    );

    const listingUrlMatchesOrganisation =
        Boolean(organisationDomain) &&
        Boolean(listingUrlDomain) &&
        listingUrlDomain === organisationDomain;

    const normalisedListingUrl =
        listingUrl.trim().startsWith("http://") ||
            listingUrl.trim().startsWith("https://")
            ? listingUrl.trim()
            : `https://${listingUrl.trim()}`;


    function handleListingTypeChange(
        newListingType: ListingType
    ) {
        setListingType(newListingType);
        setFormError("");

        if (newListingType === "individual") {
            setNumberOfAnimals(1);

            /*
             * Keep the first animal but remove additional group animals.
             */
            setAnimals((currentAnimals) => {
                return currentAnimals.length > 0
                    ? [currentAnimals[0]]
                    : [createEmptyAnimal()];
            });

            return;
        }

        /*
         * Group listings must contain at least two animals.
         */
        setNumberOfAnimals(2);

        setAnimals((currentAnimals) => {
            if (currentAnimals.length >= 2) {
                return currentAnimals;
            }

            return [
                ...currentAnimals,
                createEmptyAnimal(),
            ];
        });
    }

    function handleNumberOfAnimalsChange(
        requestedNumber: number
    ) {
        /*
         * Limit group listings to between 2 and 4 animals.
         */
        const safeNumber = Math.min(
            4,
            Math.max(2, requestedNumber)
        );

        setNumberOfAnimals(safeNumber);

        setAnimals((currentAnimals) => {
            if (
                currentAnimals.length ===
                safeNumber
            ) {
                return currentAnimals;
            }

            /*
             * Remove extra animal forms when the number decreases.
             */
            if (
                currentAnimals.length >
                safeNumber
            ) {
                return currentAnimals.slice(
                    0,
                    safeNumber
                );
            }

            /*
             * Add new empty animal forms when the number increases.
             */
            const additionalAnimals =
                Array.from(
                    {
                        length:
                            safeNumber -
                            currentAnimals.length,
                    },
                    () => createEmptyAnimal()
                );

            return [
                ...currentAnimals,
                ...additionalAnimals,
            ];
        });
    }

    function updateAnimal(
        animalId: string,
        field: keyof ListingAnimalForm,
        value: string
    ) {
        setAnimals((currentAnimals) =>
            currentAnimals.map((animal) =>
                animal.id === animalId
                    ? {
                        ...animal,
                        [field]: value,
                    }
                    : animal
            )
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
            return `The listing URL must use ${organisationDomain}.`;
        }

        if (!organisationProfile?.townCity) {
            return "Your organisation profile must contain a location.";
        }

        if (listingPhotos.length === 0) {
            return "Please upload at least one listing photo.";
        }

        if (!matchingProfileComplete) {
            return "Please complete every matching profile field.";
        }

        if (!healthProfileComplete) {
            return "Please complete every question in the Health & Care section.";
        }

        const incompleteAnimal =
            animals.find((animal) => {
                return (
                    !animal.name.trim() ||
                    !animal.animalType ||
                    !animal.sex ||
                    !animal.ageText.trim()
                );
            });

        if (incompleteAnimal) {
            return "Please complete the required details for every animal.";
        }

        return "";
    }

    /**
     * Handle submit validates all entries and stores all information in the listingInput object
     * @param event 
     * @returns 
     */

    function handleSubmit(
        event: SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const validationError =
            validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        setFormError("");

        const listingInput: CreateListingInput = {
            title: listingTitle.trim(),

            listingType,

            animalType: listingAnimalType,

            numberOfAnimals:
                listingType === "group"
                    ? numberOfAnimals
                    : 1,

            description: description.trim(),

            listingUrl: normalisedListingUrl,

            locationTown:
                organisationProfile?.townCity ??
                "",

            vaccinationStatus,
            microchipStatus,
            neuteredStatus,
            healthNotes: healthNotes.trim(),

            matchingProfile: {
                petCost: matchingProfile.petCost,
                spaceNeeded: matchingProfile.spaceNeeded,
                experienceNeeded:
                    matchingProfile.experienceNeeded,
                activityNeeded:
                    matchingProfile.activityNeeded,
                attentionNeeded:
                    matchingProfile.attentionNeeded,
                homeType: matchingProfile.homeType,
            },

            animals: animals.map((animal) => ({
                ...animal,

                name: animal.name.trim(),

                breedSpecies:
                    animal.breedSpecies.trim(),

                ageText:
                    animal.ageText.trim(),

                temperament:
                    animal.temperament.trim(),
            })),
        };

        console.log(
            "Listing ready to submit:",
            listingInput
        );

        /*
         * will eventually submit this to dynamoDB
         * for example: 
         * await createPetListing(listingInput);
         */

        setShowModal(true);
    }

    return (
        <main className="create-listing-page">
            <header className="create-listing-header">
                <h1>Create Listing</h1>

                <p>
                    Add a new pet listing for adopters
                    to discover.
                </p>
            </header>

            <form
                className="create-listing-form"
                onSubmit={handleSubmit}
            >
                <section className="create-listing-section">
                    <h2>1. Listing basics </h2>

                    <div className="listing-basics-grid">
                        <label className="create-listing-field">
                            <span>
                                Listing title
                                <strong>*</strong>
                            </span>

                            <input
                                type="text"
                                value={listingTitle}
                                onChange={(event) =>
                                    setListingTitle(
                                        event.target.value
                                    )
                                }
                                placeholder={
                                    listingType === "individual" ? "e.g. Winnie" : "e.g. Winnie and Harley"}
                                maxLength={100}
                                required
                            />

                            <small>
                                Enter any suitable title for
                                this listing.
                            </small>
                        </label>

                        <fieldset className="listing-type-field">
                            <legend>
                                Listing type
                                <strong>*</strong>
                            </legend>

                            <div className="listing-type-options">
                                <button
                                    type="button"
                                    className={
                                        listingType ===
                                            "individual"
                                            ? "listing-type-option listing-type-option-selected"
                                            : "listing-type-option"
                                    }
                                    onClick={() =>
                                        handleListingTypeChange(
                                            "individual"
                                        )
                                    }
                                >
                                    <UserRound size={18} />

                                    Individual
                                </button>

                                <button
                                    type="button"
                                    className={
                                        listingType ===
                                            "group"
                                            ? "listing-type-option listing-type-option-selected"
                                            : "listing-type-option"
                                    }
                                    onClick={() =>
                                        handleListingTypeChange(
                                            "group"
                                        )
                                    }
                                >
                                    <UsersRound size={18} />

                                    Group
                                </button>
                            </div>

                            <small>
                                {listingType ===
                                    "individual"
                                    ? "Use this for one animal."
                                    : "Use this when the animals must go together."}
                            </small>
                        </fieldset>

                        {listingType === "group" && (
                            <label className="create-listing-field">
                                <span>
                                    Number of animals
                                    <strong>*</strong>
                                </span>

                                <input
                                    type="number"
                                    min={2}
                                    max={4}
                                    value={
                                        numberOfAnimals
                                    }
                                    onChange={(event) =>
                                        handleNumberOfAnimalsChange(
                                            Number(
                                                event.target
                                                    .value
                                            )
                                        )
                                    }
                                    required
                                />

                                <small>
                                    Enter between 2 and 4
                                    animals.
                                </small>
                            </label>
                        )}

                        <label className="create-listing-field">
                            <span>
                                Animal type
                                <strong>*</strong>
                            </span>

                            <select
                                value={listingAnimalType}
                                onChange={(event) =>
                                    setListingAnimalType(
                                        event.target
                                            .value as ListingAnimalCategory
                                    )
                                }
                                required
                            >
                                {listingAnimalTypeOptions.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {option.label}
                                        </option>
                                    )
                                )}
                            </select>

                            {listingType === "group" && (
                                <small>
                                    Select Mixed if the group
                                    contains different animal
                                    types.
                                </small>
                            )}
                        </label>

                        <label className="create-listing-field create-listing-description">
                            <span>
                                Description or overview
                                <strong>*</strong>
                            </span>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder={
                                    listingType === "group"
                                        ? "Describe the animals and why they are being listed together..."
                                        : "Describe the animal and the home they need..."
                                }
                                maxLength={1000}
                                required
                            />

                            <small>
                                {description.length}/1000
                                characters
                            </small>
                        </label>

                        <label className="create-listing-field listing-location-field">
                            <span>
                                Location
                            </span>



                            <div className="listing-readonly-input">
                                <input
                                    type="text"
                                    value={
                                        organisationLocation ||
                                        "No location available"
                                    }
                                    disabled
                                    readOnly
                                />

                                <Lock
                                    size={16}
                                    aria-hidden="true"
                                />
                            </div>


                        </label>

                        <label className="create-listing-field listing-url-field">
                            <span>
                                Listing URL
                                <strong>*</strong>
                            </span>

                            <input
                                type="url"
                                value={listingUrl}
                                onChange={(event) =>
                                    setListingUrl(event.target.value)
                                }
                                placeholder={
                                    organisationDomain
                                        ? `https://${organisationDomain}/pets/example`
                                        : "https://your-organisation.org/pets/example"
                                }
                                aria-invalid={
                                    Boolean(listingUrl) &&
                                    !listingUrlMatchesOrganisation
                                }
                                required
                            />

                            {listingUrl &&
                                !listingUrlMatchesOrganisation && (
                                    <small className="create-listing-field-error">
                                        The URL must use your organisation's
                                        domain: {organisationDomain}
                                    </small>
                                )}
                        </label>
                    </div>
                </section>

                <ListingPhotoUpload
                    photos={listingPhotos}
                    onChange={setListingPhotos}
                    sectionNumber={2}
                    maxPhotos={5}
                    maxFileSizeMb={10}
                />

                <section className="create-listing-section">
                    <div className="animal-section-heading">
                        <div>
                            <h2>
                                3.{" "}
                                {listingType === "group"
                                    ? "Animals in this group"
                                    : "Animal details"}
                            </h2>

                            <p>
                                {listingType === "group"
                                    ? "Enter the individual details for every animal in the group."
                                    : "Enter the details for the animal being listed."}
                            </p>
                        </div>

                        {listingType === "group" && (
                            <span className="animal-count">
                                {animals.length} animals
                            </span>
                        )}
                    </div>

                    <div className="listing-animal-list">
                        {animals.map(
                            (animal, index) => (
                                <article
                                    key={animal.id}
                                    className="listing-animal-card"
                                >
                                    <h3>
                                        {listingType ===
                                            "group"
                                            ? `Animal ${index + 1}`
                                            : "Animal"}
                                    </h3>

                                    <div className="listing-animal-fields">
                                        <label className="create-listing-field">
                                            <span>
                                                Name
                                                <strong>
                                                    *
                                                </strong>
                                            </span>

                                            <input
                                                type="text"
                                                value={
                                                    animal.name
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateAnimal(
                                                        animal.id,
                                                        "name",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Animal name"
                                                required
                                            />
                                        </label>

                                        <label className="create-listing-field">
                                            <span>
                                                Animal type
                                                <strong>
                                                    *
                                                </strong>
                                            </span>

                                            <select
                                                value={
                                                    animal.animalType
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateAnimal(
                                                        animal.id,
                                                        "animalType",
                                                        event
                                                            .target
                                                            .value as AnimalType
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select type
                                                </option>

                                                {individualAnimalTypeOptions.map(
                                                    (
                                                        option
                                                    ) => (
                                                        <option
                                                            key={
                                                                option.value
                                                            }
                                                            value={
                                                                option.value
                                                            }
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </label>

                                        <label className="create-listing-field">
                                            <span>
                                                Breed or
                                                species
                                            </span>

                                            <input
                                                type="text"
                                                value={
                                                    animal.breedSpecies
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateAnimal(
                                                        animal.id,
                                                        "breedSpecies",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="e.g. Labrador"
                                            />
                                        </label>

                                        <label className="create-listing-field">
                                            <span>
                                                Sex
                                                <strong>
                                                    *
                                                </strong>
                                            </span>

                                            <select
                                                value={
                                                    animal.sex
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateAnimal(
                                                        animal.id,
                                                        "sex",
                                                        event
                                                            .target
                                                            .value as AnimalSex
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select sex
                                                </option>

                                                {animalSexOptions.map(
                                                    (
                                                        option
                                                    ) => (
                                                        <option
                                                            key={
                                                                option.value
                                                            }
                                                            value={
                                                                option.value
                                                            }
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </label>

                                        <label className="create-listing-field">
                                            <span>
                                                Age
                                                <strong>
                                                    *
                                                </strong>
                                            </span>

                                            <input
                                                type="text"
                                                value={
                                                    animal.ageText
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateAnimal(
                                                        animal.id,
                                                        "ageText",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="e.g. 2 years"
                                                required
                                            />
                                        </label>

                                        <label className="create-listing-field">
                                            <span>
                                                Temperament
                                            </span>

                                            <input
                                                type="text"
                                                value={
                                                    animal.temperament
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateAnimal(
                                                        animal.id,
                                                        "temperament",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="e.g. Calm and friendly"
                                            />
                                        </label>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                </section>

                <MatchingProfileSection
                    value={matchingProfile}
                    onChange={setMatchingProfile}
                    sectionNumber={4}
                />

                <section className="create-listing-section">
                    <h2>5. Health & care</h2>

                    <div className="health-care-grid">
                        <label className="create-listing-field">
                            <span>
                                Vaccination status
                                <strong>*</strong>
                            </span>

                            <select
                                value={vaccinationStatus}
                                onChange={(event) =>
                                    setVaccinationStatus(
                                        event.target.value as VaccinationStatus
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select status
                                </option>

                                <option value="up_to_date">
                                    Up to date
                                </option>

                                <option value="partially_vaccinated">
                                    Partially vaccinated
                                </option>

                                <option value="not_vaccinated">
                                    Not vaccinated
                                </option>

                            </select>
                        </label>

                        <label className="create-listing-field">
                            <span>
                                Microchip status
                                <strong>*</strong>
                            </span>

                            <select
                                value={microchipStatus}
                                onChange={(event) =>
                                    setMicrochipStatus(
                                        event.target.value as MicrochipStatus
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select status
                                </option>

                                <option value="microchipped">
                                    Microchipped
                                </option>

                                <option value="not_microchipped">
                                    Not microchipped
                                </option>
                            </select>
                        </label>

                        <label className="create-listing-field">
                            <span>
                                Neutered status
                                <strong>*</strong>
                            </span>

                            <select
                                value={neuteredStatus}
                                onChange={(event) =>
                                    setNeuteredStatus(
                                        event.target.value as NeuteredStatus
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select status
                                </option>

                                <option value="neutered">
                                    Neutered or spayed
                                </option>

                                <option value="not_neutered">
                                    Not neutered
                                </option>
                            </select>
                        </label>

                        <label className="create-listing-field health-notes-field">
                            <span>Health notes</span>

                            <textarea
                                value={healthNotes}
                                onChange={(event) =>
                                    setHealthNotes(event.target.value)
                                }
                                placeholder="Add any known conditions, medication or ongoing care requirements..."
                                maxLength={1000}
                            />

                            <small>
                                {healthNotes.length}/1000 characters
                            </small>
                        </label>
                    </div>

                    <VeterinaryDocumentUpload
                        documents={veterinaryDocuments}
                        onChange={setVeterinaryDocuments}
                        maxFiles={10}
                        maxFileSizeMb={10}
                        required
                    />
                </section>

                {formError && (
                    <p className="create-listing-error">
                        {formError}
                    </p>
                )}

                <CustomButton
                    label="Submit for review"
                    icon={<Send size={22} />}
                    type="submit"
                    className="create-listing-continue"
                />
            </form>
            <InfoModal
                visible={showModal}
                title="Review"
                message="Your listing will now be reviewed by our team before it goes live. This helps us ensure that every listing is genuine and safe for our users."
                warning="Note: You will be notified when a decision has been made!"
                icon={Shield}
                buttonText="Continue"
                onClose={() => {
                    setShowModal(false);
                    navigate(
                        routes.home.myListings
                    );
                }}
                onConfirm={() => {
                    setShowModal(false);
                    navigate(
                        routes.home.myListings
                    );
                }}
            />
        </main>
    );
}
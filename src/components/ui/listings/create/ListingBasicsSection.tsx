import {
    Lock,
    UserRound,
    UsersRound,
} from "lucide-react";

import {
    listingAnimalTypeOptions,
} from "../../../../data/listingOptions";

import type {
    ListingAnimalCategory,
    ListingType,
} from "../../../../types/listing";

type ListingBasicsSectionProps = {
    listingTitle: string;
    listingType: ListingType;
    listingAnimalType: ListingAnimalCategory;
    numberOfAnimals: number;
    description: string;
    listingUrl: string;
    adoptionFee: string;
    organisationLocation: string;
    organisationDomain: string;
    listingUrlMatchesOrganisation: boolean;

    onListingTitleChange: (
        value: string
    ) => void;

    onListingTypeChange: (
        value: ListingType
    ) => void;

    onAnimalTypeChange: (
        value: ListingAnimalCategory
    ) => void;

    onNumberOfAnimalsChange: (
        value: number
    ) => void;

    onDescriptionChange: (
        value: string
    ) => void;

    onListingUrlChange: (
        value: string
    ) => void;

    onAdoptionFeeChange: (
        value: string
    ) => void;
};

export default function ListingBasicsSection({
    listingTitle,
    listingType,
    listingAnimalType,
    numberOfAnimals,
    description,
    listingUrl,
    adoptionFee,
    organisationLocation,
    organisationDomain,
    listingUrlMatchesOrganisation,

    onListingTitleChange,
    onListingTypeChange,
    onAnimalTypeChange,
    onNumberOfAnimalsChange,
    onDescriptionChange,
    onListingUrlChange,
    onAdoptionFeeChange,
}: ListingBasicsSectionProps) {
    /*
     * Mixed should only be available for
     * group listings.
     */
    const availableAnimalTypes =
        listingType === "group"
            ? listingAnimalTypeOptions
            : listingAnimalTypeOptions.filter(
                  (option) =>
                      option.value !== "mixed"
              );

    return (
        <section className="create-listing-section">
            <h2>1. Listing basics</h2>

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
                            onListingTitleChange(
                                event.target.value
                            )
                        }
                        placeholder={
                            listingType ===
                            "individual"
                                ? "e.g. Winnie"
                                : "e.g. Winnie and Harley"
                        }
                        maxLength={100}
                        required
                    />

                    <small>
                        Enter a suitable title for
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
                                onListingTypeChange(
                                    "individual"
                                )
                            }
                        >
                            <UserRound
                                size={18}
                            />

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
                                onListingTypeChange(
                                    "group"
                                )
                            }
                        >
                            <UsersRound
                                size={18}
                            />

                            Group
                        </button>
                    </div>

                    <small>
                        {listingType ===
                        "individual"
                            ? "Use this for one animal."
                            : "Use this when the animals must be adopted together."}
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
                                onNumberOfAnimalsChange(
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
                        value={
                            listingAnimalType
                        }
                        onChange={(event) =>
                            onAnimalTypeChange(
                                event.target
                                    .value as ListingAnimalCategory
                            )
                        }
                        required
                    >
                        {availableAnimalTypes.map(
                            (option) => (
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

                    {listingType ===
                        "group" && (
                        <small>
                            Select Mixed when
                            the group contains
                            different animal
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
                            onDescriptionChange(
                                event.target.value
                            )
                        }
                        placeholder={
                            listingType ===
                            "group"
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
            </div>

            <div className="listing-basics-grid">
                <label className="create-listing-field listing-url-field">
                    <span>
                        Listing URL
                        <strong>*</strong>
                    </span>

                    <input
                        type="url"
                        value={listingUrl}
                        onChange={(event) =>
                            onListingUrlChange(
                                event.target.value
                            )
                        }
                        placeholder={
                            organisationDomain
                                ? `https://${organisationDomain}/pets/example`
                                : "https://your-organisation.org/pets/example"
                        }
                        required
                    />

                    {listingUrl &&
                        !listingUrlMatchesOrganisation && (
                            <small className="create-listing-field-error">
                                The URL must use
                                your organisation's
                                domain:{" "}
                                {
                                    organisationDomain
                                }
                            </small>
                        )}
                </label>

                <label className="create-listing-field adoption-fee-field">
                    <span>
                        Adoption fee (£)
                        <strong>*</strong>
                    </span>

                    <div className="adoption-fee-input">
                        <input
                            type="number"
                            min={10} //changed to 10 from 0. Advertising as free attracts malicious individuals src: https://warringtonanimalwelfare.org.uk/never-give-a-pet-away/
                            max={1000}
                            step={1}
                            inputMode="numeric"
                            value={adoptionFee}
                            onChange={(event) =>
                                onAdoptionFeeChange(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. 150"
                            required
                        />
                    </div>

                    <small>
                        {listingType ===
                        "group"
                            ? "Enter the total adoption fee for the group."
                            : "Enter the adoption fee for this animal."}
                    </small>
                </label>

                <label className="create-listing-field listing-location-field">
                    <span>Location</span>

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

                        <Lock size={16} />
                    </div>

                    <small>
                        Location is taken from
                        your organisation profile.
                    </small>
                </label>
            </div>
        </section>
    );
}
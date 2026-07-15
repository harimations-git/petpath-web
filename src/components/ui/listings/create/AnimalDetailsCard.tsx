import type {
    AnimalSex,
    AnimalType,
    ListingAnimalForm,
    ListingType,
} from "../../../../types/listing";

import {
    animalSexOptions,
    individualAnimalTypeOptions,
} from "../../../../data/listingOptions";

import FormSelect from "./FormSelect";

type AnimalDetailsCardProps = {
    animal: ListingAnimalForm;
    index: number;
    listingType: ListingType;

    onChange: (
        animalId: string,
        field: keyof ListingAnimalForm,
        value: string
    ) => void;
};

export default function AnimalDetailsCard({
    animal,
    index,
    listingType,
    onChange,
}: AnimalDetailsCardProps) {
    return (
        <article className="listing-animal-card">
            <h3>
                {listingType === "group"
                    ? `Animal ${index + 1}`
                    : "Animal"}
            </h3>

            <div className="listing-animal-fields">
                <label className="create-listing-field">
                    <span>
                        Name
                        <strong>*</strong>
                    </span>

                    <input
                        type="text"
                        value={animal.name}
                        onChange={(event) =>
                            onChange(
                                animal.id,
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="Animal name"
                        required
                    />
                </label>

                <FormSelect
                    label="Animal type"
                    value={animal.animalType}
                    options={
                        individualAnimalTypeOptions
                    }
                    onChange={(value) =>
                        onChange(
                            animal.id,
                            "animalType",
                            value as AnimalType
                        )
                    }
                    placeholder="Select type"
                    required
                />

                <label className="create-listing-field">
                    <span>
                        Breed or species
                    </span>

                    <input
                        type="text"
                        value={
                            animal.breedSpecies
                        }
                        onChange={(event) =>
                            onChange(
                                animal.id,
                                "breedSpecies",
                                event.target.value
                            )
                        }
                        placeholder="e.g. Labrador"
                    />
                </label>

                <FormSelect
                    label="Sex"
                    value={animal.sex}
                    options={animalSexOptions}
                    onChange={(value) =>
                        onChange(
                            animal.id,
                            "sex",
                            value as AnimalSex
                        )
                    }
                    placeholder="Select sex"
                    required
                />

                <label className="create-listing-field">
                    <span>
                        Age
                        <strong>*</strong>
                    </span>

                    <input
                        type="text"
                        value={animal.ageText}
                        onChange={(event) =>
                            onChange(
                                animal.id,
                                "ageText",
                                event.target.value
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
                        onChange={(event) =>
                            onChange(
                                animal.id,
                                "temperament",
                                event.target.value
                            )
                        }
                        placeholder="e.g. Calm and friendly"
                    />
                </label>
            </div>
        </article>
    );
}
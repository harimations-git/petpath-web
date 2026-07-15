import type {
    ListingAnimalForm,
    ListingType,
} from "../../../../types/listing";

import AnimalDetailsCard from "./AnimalDetailsCard";

type AnimalDetailsSectionProps = {
    animals: ListingAnimalForm[];
    listingType: ListingType;

    onAnimalChange: (
        animalId: string,
        field: keyof ListingAnimalForm,
        value: string
    ) => void;
};

export default function AnimalDetailsSection({
    animals,
    listingType,
    onAnimalChange,
}: AnimalDetailsSectionProps) {
    return (
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
                        <AnimalDetailsCard
                            key={animal.id}
                            animal={animal}
                            index={index}
                            listingType={
                                listingType
                            }
                            onChange={
                                onAnimalChange
                            }
                        />
                    )
                )}
            </div>
        </section>
    );
}
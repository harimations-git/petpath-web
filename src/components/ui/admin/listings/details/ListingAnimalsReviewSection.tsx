import { PawPrint } from "lucide-react";

import type { AdminListingDetails } from "../../../../../types/admin/adminListing";
import { formatDisplayValue } from "../../../../../utils/listings/displayFormatting";

import ReadOnlyField from "../../ReadOnlyField";
import ReviewSection from "./ReviewSection";

type ListingAnimalsReviewSectionProps = {
    animals: AdminListingDetails["animals"];
};

export default function ListingAnimalsReviewSection({
    animals,
}: ListingAnimalsReviewSectionProps) {
    const sortedAnimals =
        [...animals].sort(
            (first, second) =>
                first.animalOrder -
                second.animalOrder
        );

    return (
        <ReviewSection
            title="Animal details"
            description="Information about each animal included in the listing."
            icon={PawPrint}
        >
            {sortedAnimals.length > 0 ? (
                <div className="admin-listing-review-animals">
                    {sortedAnimals.map(
                        (animal, index) => (
                            <article
                                key={animal.animalId}
                                className="admin-listing-review-animal"
                            >
                                <div className="admin-listing-review-animal-heading">
                                    <div className="admin-listing-review-animal-icon">
                                        <PawPrint size={18} />
                                    </div>

                                    <div>
                                        {sortedAnimals.length !== 1 && (
                                            <span>
                                                Animal {index + 1}
                                            </span>
                                        )}
                                        <h3>
                                            {animal.name || "Unnamed animal"}
                                        </h3>
                                    </div>
                                </div>

                                <div className="admin-listing-review-animal-grid">
                                    <ReadOnlyField
                                        label="Breed or species"
                                        value={animal.breedSpecies}
                                    />

                                    <ReadOnlyField
                                        label="Age"
                                        value={animal.ageText}
                                    />

                                    <ReadOnlyField
                                        label="Sex"
                                        value={formatDisplayValue(animal.sex ?? "")}
                                    />

                                    <ReadOnlyField
                                        label="Temperament"
                                        value={animal.temperament}
                                        fullWidth
                                    />
                                </div>
                            </article>
                        )
                    )}
                </div>
            ) : (
                <div className="admin-listing-review-empty-section">
                    <PawPrint size={28} />

                    <p>
                        No animal details were returned.
                    </p>
                </div>
            )}
        </ReviewSection>
    );
}
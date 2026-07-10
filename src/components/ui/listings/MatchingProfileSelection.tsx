import {
    Activity,
    BadgePoundSterling,
    Clock,
    Home, 
    Leaf,
    UserRoundCheck,
} from "lucide-react";

import FormSelect from "../forms/FormSelect";

import {
    activityNeededOptions,
    attentionNeededOptions,
    experienceNeededOptions,
    matchingHomeTypeOptions,
    petCostOptions,
    spaceNeededOptions,
} from "../../../data/matchingProfileOptions";

import type {
    ActivityNeeded,
    AttentionNeeded,
    ExperienceNeeded,
    MatchingHomeType,
    MatchingProfileForm,
    PetCost,
    SpaceNeeded,
} from "../../../types/matchingProfile";

import "./MatchingProfileSelection.css";

type MatchingProfileSectionProps = {
    value: MatchingProfileForm;
    onChange: (matchingProfile: MatchingProfileForm) => void; //receives updated form object, returns nothing
    sectionNumber?: number;
};

export default function MatchingProfileSection({
    value,
    onChange,
    sectionNumber = 5,
}: MatchingProfileSectionProps) {
    function updateField<
        Field extends keyof MatchingProfileForm
    >(
        field: Field,
        fieldValue: MatchingProfileForm[Field]
    ) {
        onChange({
            ...value,
            [field]: fieldValue,
        });
    }

    return (
        <section className="create-listing-section matching-profile-section">
            <div className="matching-profile-heading">
                <div>
                    <div className="matching-profile-title">
                        <h2>
                            {sectionNumber}. Matching profile
                        </h2>
                    </div>

                    <p>
                        These details help PetPath match your
                        listings with suitable adopters.
                    </p>
                </div>
            </div>

            <div className="matching-profile-grid">
                <FormSelect
                    label="Pet cost"
                    value={value.petCost}
                    options={petCostOptions}
                    onChange={(selectedValue) =>
                        updateField(
                            "petCost",
                            selectedValue as PetCost
                        )
                    }
                    placeholder="Select pet cost"
                    helperText="Estimate the ongoing monthly cost of caring for the animal."
                    icon={
                        <BadgePoundSterling size={17} />
                    }
                    required
                />

                <FormSelect
                    label="Space needed"
                    value={value.spaceNeeded}
                    options={spaceNeededOptions}
                    onChange={(selectedValue) =>
                        updateField(
                            "spaceNeeded",
                            selectedValue as SpaceNeeded
                        )
                    }
                    placeholder="Select space needed"
                    helperText="Choose the outdoor space this animal requires."
                    icon={<Leaf size={17} />}
                    required
                />

                <FormSelect
                    label="Experience needed"
                    value={value.experienceNeeded}
                    options={experienceNeededOptions}
                    onChange={(selectedValue) =>
                        updateField(
                            "experienceNeeded",
                            selectedValue as ExperienceNeeded
                        )
                    }
                    placeholder="Select experience needed"
                    helperText="Choose the recommended level of pet ownership experience."
                    icon={
                        <UserRoundCheck size={17} />
                    }
                    required
                />

                <FormSelect
                    label="Activity needed"
                    value={value.activityNeeded}
                    options={activityNeededOptions}
                    onChange={(selectedValue) =>
                        updateField(
                            "activityNeeded",
                            selectedValue as ActivityNeeded
                        )
                    }
                    placeholder="Select activity level"
                    helperText="Estimate the exercise and activity level required."
                    icon={<Activity size={17} />}
                    required
                />

                <FormSelect
                    label="Pet attention needed"
                    value={value.attentionNeeded}
                    options={attentionNeededOptions}
                    onChange={(selectedValue) =>
                        updateField(
                            "attentionNeeded",
                            selectedValue as AttentionNeeded
                        )
                    }
                    placeholder="Select attention needed"
                    helperText="Estimate how much daily companionship the animal needs."
                    icon={<Clock size={17} />}
                    required
                />

                <FormSelect
                    label="Home type"
                    value={value.homeType}
                    options={matchingHomeTypeOptions}
                    onChange={(selectedValue) =>
                        updateField(
                            "homeType",
                            selectedValue as MatchingHomeType
                        )
                    }
                    placeholder="Select a home type"
                    helperText="Choose the most suitable type of home."
                    icon={<Home size={17} />}
                    required
                />
            </div>
        </section>
    );
}
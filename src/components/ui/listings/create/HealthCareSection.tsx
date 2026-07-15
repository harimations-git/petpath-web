import type {
    MicrochipStatus,
    NeuteredStatus,
    VaccinationStatus,
} from "../../../../types/vetInformation";

import {
    microchipStatusOptions,
    neuteredStatusOptions,
    vaccinationStatusOptions,
} from "../../../../data/listingOptions";

import VeterinaryDocumentUpload from "../VeterinaryDocumentUpload";
import FormSelect from "./FormSelect";

type HealthCareSectionProps = {
    vaccinationStatus:
        VaccinationStatus;

    microchipStatus:
        MicrochipStatus;

    neuteredStatus:
        NeuteredStatus;

    healthNotes: string;
    documents: File[];

    onVaccinationChange: (
        value: VaccinationStatus
    ) => void;

    onMicrochipChange: (
        value: MicrochipStatus
    ) => void;

    onNeuteredChange: (
        value: NeuteredStatus
    ) => void;

    onHealthNotesChange: (
        value: string
    ) => void;

    onDocumentsChange: (
        documents: File[]
    ) => void;
};

export default function HealthCareSection({
    vaccinationStatus,
    microchipStatus,
    neuteredStatus,
    healthNotes,
    documents,
    onVaccinationChange,
    onMicrochipChange,
    onNeuteredChange,
    onHealthNotesChange,
    onDocumentsChange,
}: HealthCareSectionProps) {
    return (
        <section className="create-listing-section">
            <h2>5. Health & care</h2>

            <div className="health-care-grid">
                <FormSelect
                    label="Vaccination status"
                    value={vaccinationStatus}
                    options={
                        vaccinationStatusOptions
                    }
                    onChange={(value) =>
                        onVaccinationChange(
                            value as VaccinationStatus
                        )
                    }
                    required
                />

                <FormSelect
                    label="Microchip status"
                    value={microchipStatus}
                    options={
                        microchipStatusOptions
                    }
                    onChange={(value) =>
                        onMicrochipChange(
                            value as MicrochipStatus
                        )
                    }
                    required
                />

                <FormSelect
                    label="Neutered status"
                    value={neuteredStatus}
                    options={
                        neuteredStatusOptions
                    }
                    onChange={(value) =>
                        onNeuteredChange(
                            value as NeuteredStatus
                        )
                    }
                    required
                />

                <label className="create-listing-field health-notes-field">
                    <span>Health notes</span>

                    <textarea
                        value={healthNotes}
                        onChange={(event) =>
                            onHealthNotesChange(
                                event.target.value
                            )
                        }
                        placeholder="Add any known conditions, medication or ongoing care requirements..."
                        maxLength={1000}
                    />

                    <small>
                        {healthNotes.length}/1000
                        characters
                    </small>
                </label>
            </div>

            <VeterinaryDocumentUpload
                documents={documents}
                onChange={
                    onDocumentsChange
                }
                maxFiles={10}
                maxFileSizeMb={10}
                required
            />
        </section>
    );
}
import { Building2 } from "lucide-react";

type ProfileAboutSectionProps = {
    description: string;
    onDescriptionChange:(value: string) => void;
};

/**
 * Component that renders the about section of the profile setup page
 * Handles the description state
 * @param param0 
 * @returns 
 */
export default function ProfileAboutSection({
    description,
    onDescriptionChange,
}: ProfileAboutSectionProps) {
    return (
        <>
            <div className="organisation-form-section-heading">
                <Building2 size={23}/>

                <div>
                    <h2>
                        About your organisation
                    </h2>

                    <p>
                        Briefly describe your
                        work, values and the
                        animals you support.
                    </p>
                </div>
            </div>


            <label className="organisation-description-field">
                <span>
                    Organisation description
                </span>

                <textarea
                    value={description}
                    onChange={(event) => onDescriptionChange(event.target.value)}
                    placeholder="Tell adopters about your organisation, your work and the animals you care for..."
                    maxLength={1000}
                    required
                />

                <small>
                    {description.length}/1000
                    characters
                </small>
            </label>
        </>
    );
}
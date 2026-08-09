import { Globe2 } from "lucide-react"
import TextInput from "../../../../components/ui/forms/TextInput";

type ProfileOnlineSectionProps = {
    websiteUrl: string;
    websiteDomain: string;
    onWebsiteChange: (value: string) => void;
};

/**
 * Component that renders and handles the Online section and website 
 * state of the Profile Setup page
 * @param param0 
 * @returns 
 */
export default function ProfileOnlineSection({
    websiteUrl,
    websiteDomain,
    onWebsiteChange,
}: ProfileOnlineSectionProps) {
    return (
        <>
            <div className="organisation-form-section-heading">
                <Globe2 size={23} />

                <div>
                    <h2>
                        Online presence
                    </h2>

                    <p>
                        Add the official website
                        used by your organisation. Please note that your website URL cannot be changed.
                    </p>
                </div>
            </div>

            <div className="organisation-fields-grid">
                <TextInput
                    label="Website homepage"
                    placeholder="https://yourorganisation.org"
                    type="text"
                    icon={<Globe2 size={20}/>}
                    value={websiteUrl}
                    onChange={onWebsiteChange}
                    required
                />

                <label className="organisation-standard-field">
                    <span>
                        Website domain
                    </span>

                    <input
                        value={websiteDomain}
                        placeholder="Automatically detected"
                        disabled
                        readOnly
                    />

                    <small>
                        This is automatically
                        taken from your website.
                    </small>
                </label>
            </div>
        </>
    );
}
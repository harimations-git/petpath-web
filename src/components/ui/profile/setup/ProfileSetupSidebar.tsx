import { BadgeCheck, Building2, ImagePlus, Mail } from "lucide-react";
import type { ChangeEvent } from "react";
import type { OrganisationProfile } from "../../../../services/organisation/organisationService";


type ProfileSetupSidebarProps = {
    organisationProfile: OrganisationProfile | null;
    profileImagePreview: string;
    onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Component that renders the side bar in the profile setup page
 * @param param0 
 * @returns 
 */
export default function ProfileSetupSidebar({
    organisationProfile,
    profileImagePreview,
    onImageChange,
}: ProfileSetupSidebarProps) {
    return (
        <section className="organisation-profile-sidebar">
            <div className="organisation-profile-image-section">
                <div className="organisation-profile-image-preview">
                    {profileImagePreview ? (
                        <img
                            src={ profileImagePreview}
                            alt="Organisation profile preview"
                        />
                    ) : (
                        <Building2 size={54}/>
                    )}
                </div>

                <label className="organisation-profile-image-button">
                    <ImagePlus size={19}/>

                    {profileImagePreview
                        ? "Change profile picture"
                        : "Add profile picture"}

                    <input
                        type="file"
                        accept={"image/jpeg,image/png,image/webp"}
                        onChange={onImageChange}
                    />
                </label>

                <p>
                    JPG, PNG or WEBP.
                    Maximum size 5MB.
                </p>
            </div>


            <div className="organisation-locked-details">
                <h2>
                    Verified Charity details
                </h2>

                <div className="organisation-locked-detail">
                    <Building2 size={19}/>

                    <div>
                        <span>
                            Charity name
                        </span>

                        <strong>
                            {organisationProfile?.charityName}
                        </strong>
                    </div>
                </div>


                <div className="organisation-locked-detail">
                    <BadgeCheck size={19}/>

                    <div>
                        <span>
                            Charity ID
                        </span>

                        <strong>
                            {organisationProfile?.charityId}
                        </strong>
                    </div>
                </div>


                <div className="organisation-locked-detail">
                    <Mail size={19}/>

                    <div>
                        <span>
                            Account email
                        </span>

                        <strong>
                            {organisationProfile?.email}
                        </strong>
                    </div>
                </div>


                <p className="organisation-locked-help">
                    These verified details
                    cannot be changed.
                </p>
            </div>
        </section>
    );
}
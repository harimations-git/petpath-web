import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    BadgeCheck,
    Building2,
    Globe2,
    ImagePlus,
    Mail,
    MapPin,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Logo from "../../components/ui/Logo";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import CustomButton from "../../components/ui/CustomButton";
import DecorativeLeaf from "../../components/ui/DecorativeLeaf";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import {
    getCurrentOrganisationProfile,
    completeOrganisationProfile,
    uploadOrganisationProfileImage,
    type OrganisationProfile,
} from "../../services/organisation/organisationService";



import { routes } from "../../constants/routes";

import "./ProfileSetup.css";
import Spacer from "../../components/layout/Spacer";
import { useBackButtonRedirect } from "../../hooks/dashboard/useBackButtonRedirect";
import { useOrganisationProfile } from "../../context/OrganisationProfileContext";


export default function ProfileSetup() {
    useBackButtonRedirect(routes.home.dashboard);

    const navigate = useNavigate();
    const {
        updateCachedOrganisationProfile, refreshOrganisationProfile
    } = useOrganisationProfile();

    const [organisationProfile, setOrganisationProfile] = useState<OrganisationProfile | null>(null);

    const [websiteUrl, setWebsiteUrl] = useState("");
    const [description, setDescription] = useState("");

    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [townCity, setTownCity] = useState("");
    const [county, setCounty] = useState("");
    const [postcode, setPostcode] = useState("");
    const [country, setCountry] = useState("United Kingdom");

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const websiteDomain = useMemo(() => {
        if (!websiteUrl.trim()) {
            return "";
        }

        try {
            // Add https:// if the user only entered something like petpathapp.co.uk.
            const formattedUrl = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`;
            // Extract only the hostname, also removes www prefix.
            return new URL(formattedUrl).hostname.replace(/^www\./, "");
        } catch {
            // Return an empty domain when the entered website is invalid.
            return "";
        }
    }, [websiteUrl]);

    useEffect(() => {
        document.title = "Profile Setup | PetPath";

        // Prevent state updates if the component unmounts before the API request finishes.
        let isMounted = true;

        async function loadProfile() {
            try {
                const profile = await getCurrentOrganisationProfile();

                if (!isMounted) return;

                //Easy failsafes check account status and redirect them if they managed to get in
                if (profile.accountStatus === "pending") {
                    navigate(routes.auth.accountReview, {
                        replace: true,
                    });

                    return;
                }

                if (profile.accountStatus !== "approved") {
                    navigate(routes.auth.login, {
                        replace: true,
                    });

                    return;
                }

                //Might change this if I decide to reuse this page later on
                if (profile.profileComplete) {
                    navigate(routes.home.dashboard, {
                        replace: true,
                    });

                    return;
                }
                // Store the complete organisation profile for read-only details
                setOrganisationProfile(profile);

                // Pre-fill any profile fields that may already exist.
                setWebsiteUrl(profile.websiteUrl ?? "");
                setDescription(profile.description ?? "");
                setAddressLine1(profile.addressLine1 ?? "");
                setAddressLine2(profile.addressLine2 ?? "");
                setTownCity(profile.townCity ?? "");
                setCounty(profile.county ?? "");
                setPostcode(profile.postcode ?? "");
                setCountry(profile.country ?? "United Kingdom");

                // Display the existing profile image when the backend returns a URL.
                if (profile.profileImageUrl) {
                    setProfileImagePreview(profile.profileImageUrl);
                }
            } catch (error) {
                setFormError("We couldn't load your organisation profile.");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [navigate])

    useEffect(() => {
        return () => {
            //cleanup browser memory
            if (profileImagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(profileImagePreview);
            }
        };
    }, [profileImagePreview]);

    function handleProfileImageChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        //get first image chosen by user
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setFormError("Please choose a JPG, PNG or WEBP image.");
            return;
        }

        //reject files biger than 5mbs
        if (file.size > 5 * 1024 * 1024) {
            setFormError("The profile image must be smaller than 5MB.");
            return;
        }

        //remove previous local preview URL b
        if (profileImagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(profileImagePreview);
        }

        setProfileImage(file);
        //create temp browser url so user can preview the image
        setProfileImagePreview(URL.createObjectURL(file));
        setFormError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormError("");

        //validation
        if (!websiteUrl.trim() || !websiteDomain) {
            setFormError("Please enter a valid website homepage.");
            return;
        }

        if (!profileImage && !organisationProfile?.profileImageUrl) {
            setFormError("Please add your organisation's profile picture.");
            return;
        }

        if (country === "") {
            setFormError(
                `Please select a country.`
            );

            return;
        }

        const requiredAddressFields = {
            "Address line 1": addressLine1,
            "Town or city": townCity,
            "Postcode": postcode,
            "Country": country,
        };



        //list containing only fields whose values are empty.
        const missingAddressFields = Object.entries(requiredAddressFields)
            .filter(([, value]) => !value?.trim())
            .map(([label]) => label);

        if (missingAddressFields.length > 0) {
            console.log("Missing address fields:", missingAddressFields);

            setFormError(
                `Please complete: ${missingAddressFields.join(", ")}.`
            );

            return;
        }

        try {
            setIsSaving(true);

            let profileImageKey =
                organisationProfile?.profileImageKey ?? "";

            if (profileImage) {
                profileImageKey =
                    await uploadOrganisationProfileImage(
                        profileImage
                    );
            }

            if (!profileImageKey) {
                setFormError(
                    "Please upload an organisation profile picture."
                );
                return;
            }

            //send comeplte profile to the backend
            const completedProfile =
                await completeOrganisationProfile({
                    //store a complete URL, including a protocol
                    websiteUrl: websiteUrl.startsWith("http")
                        ? websiteUrl.trim()
                        : `https://${websiteUrl.trim()}`,

                    websiteDomain,
                    profileImageKey,
                    description: description.trim(),

                    addressLine1: addressLine1.trim(),
                    addressLine2: addressLine2.trim(),
                    townCity: townCity.trim(),
                    county: county.trim(),
                    postcode: postcode.trim(),
                    country,
                });

            updateCachedOrganisationProfile(
                completedProfile
            );

            refreshOrganisationProfile();

            //send the user to the dashboard after a successful save.
            navigate(routes.home.dashboard, {
                replace: true,
            });
        } catch (error) {
            console.error("Unable to complete profile:", error);

            if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError(
                    "We couldn't save your organisation profile."
                );
            }
        } finally {
            setIsSaving(false);
        }
    }

    //if loading show big spinner
    if (isLoading) {
        return (
            <LoadingSpinner
                size="xl"
                fullScreen
                label="Loading your organisation..."
            />
        );
    }

    return (
        <main className="organisation-profile-setup-page">
            <DecorativeLeaf
                top={50}
                left={-45}
                rotate={70}
                width={260}
                height={260}
            />

            <DecorativeLeaf
                bottom={-70}
                right={-20}
                rotate={-90}
                flipX
                width={260}
                height={260}
            />

            <header className="organisation-profile-setup-header">
                <Logo hasTagline size="md" />

                <div>
                    <span>Organisation onboarding</span>
                    <h1>Complete your profile</h1>
                    <p>
                        This information will help adopters understand who you
                        are and where your organisation is based.
                    </p>
                </div>
            </header>

            <Card className="organisation-profile-setup-card">
                <form
                    className="organisation-profile-setup-form"
                    onSubmit={handleSubmit}
                >
                    <section className="organisation-profile-sidebar">
                        <div className="organisation-profile-image-section">
                            <div className="organisation-profile-image-preview">
                                {profileImagePreview ? (
                                    <img
                                        src={profileImagePreview}
                                        alt="Organisation profile preview"
                                    />
                                ) : (
                                    <Building2 size={54} />
                                )}
                            </div>

                            <label className="organisation-profile-image-button">
                                <ImagePlus size={19} />
                                {profileImagePreview
                                    ? "Change profile picture"
                                    : "Add profile picture"}

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleProfileImageChange}
                                />
                            </label>

                            <p>JPG, PNG or WEBP. Maximum size 5MB.</p>
                        </div>

                        <div className="organisation-locked-details">
                            <h2>Verified Charity details</h2>

                            <div className="organisation-locked-detail">
                                <Building2 size={19} />

                                <div>
                                    <span>Charity name</span>
                                    <strong>
                                        {organisationProfile?.charityName}
                                    </strong>
                                </div>
                            </div>

                            <div className="organisation-locked-detail">
                                <BadgeCheck size={19} />

                                <div>
                                    <span>Charity ID</span>
                                    <strong>
                                        {organisationProfile?.charityId}
                                    </strong>
                                </div>
                            </div>

                            <div className="organisation-locked-detail">
                                <Mail size={19} />

                                <div>
                                    <span>Account email</span>
                                    <strong>
                                        {organisationProfile?.email}
                                    </strong>
                                </div>
                            </div>

                            <p className="organisation-locked-help">
                                These verified details cannot be changed.
                            </p>
                        </div>
                    </section>

                    <section className="organisation-profile-fields">
                        <div className="organisation-form-section-heading">
                            <Globe2 size={23} />

                            <div>
                                <h2>Online presence</h2>
                                <p>
                                    Add the official website used by your organisation.
                                </p>
                            </div>
                        </div>

                        <div className="organisation-fields-grid">
                            <TextInput
                                label="Website homepage"
                                placeholder="https://yourorganisation.org"
                                type="text"
                                icon={<Globe2 size={20} />}
                                value={websiteUrl}
                                onChange={setWebsiteUrl}
                                required
                            />

                            <label className="organisation-standard-field">
                                <span>Website domain</span>

                                <input
                                    value={websiteDomain}
                                    placeholder="Automatically detected"
                                    disabled
                                    readOnly
                                />

                                <small>
                                    This is automatically taken from your website.
                                </small>
                            </label>
                        </div>

                        <div className="organisation-form-section-heading">
                            <Building2 size={23} />

                            <div>
                                <h2>About your organisation</h2>
                                <p>
                                    Briefly describe your work, values and the animals
                                    you support.
                                </p>
                            </div>
                        </div>

                        <label className="organisation-description-field">
                            <span>Organisation description</span>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Tell adopters about your organisation, your work and the animals you care for..."
                                maxLength={1000}
                                required
                            />

                            <small>
                                {description.length}/1000 characters
                            </small>
                        </label>

                        <div className="organisation-form-section-heading">
                            <MapPin size={23} />

                            <div>
                                <h2>Organisation address</h2>
                                <p>
                                    Enter the main address associated with your
                                    organisation.
                                </p>
                            </div>
                        </div>

                        <div className="organisation-address-grid">
                            <label className="organisation-address-field organisation-address-field-wide">
                                <span>
                                    Address line 1 <strong>*</strong>
                                </span>

                                <input
                                    name="addressLine1"
                                    autoComplete="address-line1"
                                    type="text"
                                    placeholder="Building number and street"
                                    value={addressLine1}
                                    onChange={(event) => setAddressLine1(event.target.value)}
                                    required
                                />
                            </label>

                            <label className="organisation-address-field organisation-address-field-wide">
                                <span>Address line 2</span>

                                <input
                                    type="text"
                                    placeholder="Apartment, unit or additional address"
                                    value={addressLine2}
                                    onChange={(event) => setAddressLine2(event.target.value)}
                                />
                            </label>

                            <label className="organisation-address-field">
                                <span>
                                    Town or city <strong>*</strong>
                                </span>

                                <input
                                    name="townCity"
                                    autoComplete="address-line2"
                                    type="text"
                                    placeholder="Enter town or city"
                                    value={townCity}
                                    onChange={(event) => setTownCity(event.target.value)}
                                    required
                                />
                            </label>

                            <label className="organisation-address-field">
                                <span>County or region</span>

                                <input
                                    type="text"
                                    placeholder="Optional"
                                    value={county}
                                    onChange={(event) => setCounty(event.target.value)}
                                />
                            </label>

                            <label className="organisation-address-field">
                                <span>
                                    Postcode <strong>*</strong>
                                </span>

                                <input
                                    name="postcode"
                                    autoComplete="postal-code"
                                    type="text"
                                    placeholder="Enter postcode"
                                    value={postcode}
                                    onChange={(event) => setPostcode(event.target.value)}
                                    required
                                />
                            </label>

                            <label className="organisation-address-field">
                                <Spacer height={5} />
                                <span>
                                    Country <strong>*</strong>
                                </span>

                                <select
                                    name="country"
                                    autoComplete="country-name"
                                    value={country}
                                    onChange={(event) => setCountry(event.target.value)}
                                    required
                                >
                                    <option value="">Select Country</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Ireland">Ireland</option>
                                </select>
                            </label>
                        </div>

                        {formError && (
                            <p className="organisation-profile-error">
                                {formError}
                            </p>
                        )}

                        <div className="organisation-profile-submit-row">
                            <CustomButton
                                label={isSaving ? "Saving profile..." : "Save Settings"}
                                type="submit"
                                fullWidth={false}
                                className="organisation-profile-submit"
                                disabled={isSaving}
                            />

                            <p>
                                All required fields must be completed before you can create pet listings.
                            </p>
                        </div>

                    </section>
                </form>
            </Card>
        </main>
    );
}
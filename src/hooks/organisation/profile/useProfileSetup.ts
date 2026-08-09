import { useEffect, useMemo, useState, type ChangeEvent, type SubmitEvent } from "react";

import { useNavigate } from "react-router-dom";
import { useOrganisationProfile } from "../../../context/OrganisationProfileContext";
import { completeOrganisationProfile, getCurrentOrganisationProfile, uploadOrganisationProfileImage, type OrganisationProfile } from "../../../services/organisation/organisationService";
import { normaliseUrl } from "../../../utils/listings/listingUrlUtils";
import { routes } from "../../../constants/routes";
import { allowedImageTypes } from "../../../utils/imageValidation";

export function useProfileSetup() {
    const navigate = useNavigate();

    const {
        updateCachedOrganisationProfile,
        refreshOrganisationProfile,
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


    //Gets the website's domain from the website provided
    const websiteDomain =
        useMemo(() => {
            if (!websiteUrl.trim()) {
                return "";
            }

            try {
                const formattedUrl = normaliseUrl(websiteUrl)

                return new URL(formattedUrl).hostname.replace(/^www\./, "");

            } catch {
                return "";
            }
        }, [websiteUrl]);


    useEffect(() => {
        let isMounted = true;

        async function loadProfile() {
            try {
                const profile = await getCurrentOrganisationProfile();

                if (!isMounted) {
                    return;
                }


                //If the account is still pending, put them back to the pending page
                if (profile.accountStatus === "pending") {
                    navigate(routes.auth.accountReview,
                        { replace: true }
                    );

                    return;
                }


                if (profile.accountStatus !== "approved") {
                    navigate(routes.auth.login,
                        { replace: true }
                    );

                    return;
                }


                if (profile.profileComplete) {
                    navigate(routes.home.dashboard,
                        { replace: true }
                    );

                    return;
                }


                setOrganisationProfile(profile);

                setWebsiteUrl(profile.websiteUrl ?? "");

                setDescription(profile.description ?? "");

                setAddressLine1(profile.addressLine1 ?? "");
                setAddressLine2(profile.addressLine2 ?? "");

                setTownCity(profile.townCity ?? "");
                setCounty(profile.county ?? "");
                setPostcode(profile.postcode ?? "");
                setCountry(profile.country ?? "United Kingdom");


                if (profile.profileImageUrl) {
                    setProfileImagePreview(profile.profileImageUrl);
                }

            } catch {
                setFormError("We couldn't load your organisation profile.");

            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadProfile();

        return () => {
            isMounted = false;
        };

    }, [navigate]);

    useEffect(() => {
        document.title = "Profile Setup | PetPath"
    });


    //Cleanup function, removes the temporary image preview from memory
    //Runs when the image changes of is removed from the page
    useEffect(() => {
        return () => {
            if (profileImagePreview.startsWith("blob:")) { //blob before a url means temporary
                URL.revokeObjectURL(profileImagePreview);
            }
        };

    }, [profileImagePreview]);


    function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!allowedImageTypes.includes(file.type)
        ) {
            setFormError("Please choose a JPG, PNG or WEBP image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFormError("The profile image must be smaller than 5MB.");

            return;
        }


        //If the image is temporary, remove it from memory
        if (profileImagePreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(profileImagePreview);
        }


        setProfileImage(file);

        //Add the new image to memory
        setProfileImagePreview(URL.createObjectURL(file)
        );

        setFormError("");
    }


    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        //Prevents normal clicking behaviour
        event.preventDefault();
        setFormError("");

        if (!websiteUrl.trim() || !websiteDomain) {
            setFormError("Please enter a valid website homepage.");
            return;
        }

        const formattedWebsiteUrl = normaliseUrl(websiteUrl.trim());

        // Security measure, legitimate sites will be https secure
        if (!formattedWebsiteUrl.startsWith("https://")) {
            setFormError("Please enter a secure website. PetPath only allows HTTPS websites.");

            return;
        }

        if (!profileImage && !organisationProfile?.profileImageUrl) {
            setFormError("Please add your organisation's profile picture.");
            return;
        }

        if (
            !addressLine1.trim() ||
            !townCity.trim() ||
            !postcode.trim() ||
            !country.trim()
        ) {
            setFormError("Please complete all required address fields.");
            return;
        }


        try {
            setIsSaving(true);


            let profileImageKey = organisationProfile?.profileImageKey ?? "";


            if (profileImage) {
                profileImageKey = await uploadOrganisationProfileImage(profileImage);
            }

            if (!profileImageKey) {
                setFormError("Please upload an organisation profile picture.");
                return;
            }

            const completedProfile =
                await completeOrganisationProfile({
                    websiteUrl: formattedWebsiteUrl,
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


            updateCachedOrganisationProfile(completedProfile);

            void refreshOrganisationProfile();


            navigate(routes.home.dashboard,
                { replace: true }
            );

        } catch (error) {
            setFormError(
                error instanceof Error
                    ? error.message
                    : "We couldn't save your organisation profile."
            );

        } finally {
            setIsSaving(false);
        }
    }


    return {
        organisationProfile,

        websiteUrl,
        setWebsiteUrl,
        websiteDomain,

        description,
        setDescription,

        addressLine1,
        setAddressLine1,

        addressLine2,
        setAddressLine2,

        townCity,
        setTownCity,

        county,
        setCounty,

        postcode,
        setPostcode,

        country,
        setCountry,

        profileImagePreview,

        isLoading,
        isSaving,
        formError,

        handleProfileImageChange,
        handleSubmit,
    };
}
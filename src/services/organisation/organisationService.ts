import { fetchAuthSession } from "aws-amplify/auth";

export type OrganisationStatus = "pending" | "approved" | "rejected" | "suspended";

type ProfileImageUploadUrlResponse = {
  uploadUrl: string;
  profileImageKey: string;
};

export type OrganisationProfile = {
  organisationId: string;
  email: string;
  charityId: string;
  charityName: string;
  accountStatus: OrganisationStatus;

  websiteUrl?: string;
  websiteDomain?: string;
  profileImageKey?: string;
  profileImageUrl?: string;
  description?: string;

  addressLine1?: string;
  addressLine2?: string;
  townCity?: string;
  county?: string;
  postcode?: string;
  country?: string;

  locationLatitude?: number;
  locationLongitude?: number;
  locationSource?: "address";
  locationLabel?: string;
  locationGeocodedAt?: string;

  profileComplete: boolean;
  profileCompletedAt?: string;
};

export type CompleteOrganisationProfileInput = {
  websiteUrl: string;
  websiteDomain: string;
  profileImageKey: string;
  description: string;

  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  county?: string;
  postcode: string;
  country: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAuthToken() {
  const session = await fetchAuthSession({ forceRefresh: true });

  const accessToken = session.tokens?.accessToken?.toString();

  if (!accessToken) {
    throw new Error("You are not signed in.");
  }

  return accessToken;
}

export async function getCurrentOrganisationProfile() {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/organisation-profile/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    console.log("Organisation profile response:", response.status, body);
    throw new Error(body?.message || "Unable to get organisation profile.");
  }

  return body.organisationProfile;
}

export async function completeOrganisationProfile(
  input: CompleteOrganisationProfileInput
): Promise<OrganisationProfile> {
  //Get current user cognito access token
  const token = await getAuthToken();

  //send completed profile data back to the backend
  const response = await fetch(
    `${API_BASE_URL}/organisation-profile/me`,
    {
      method: "PUT",
      headers: {
        //Pass token to Cognito authoriser
        Authorization: `Bearer ${token}`,
        // Tell the API that the request body contains JSON.
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message ||
      "Unable to complete your organisation profile."
    );
  }

  return body.organisationProfile;
}

export async function getProfileImageUploadUrl(
  file: File
): Promise<ProfileImageUploadUrlResponse> {

  const token = await getAuthToken();

  //ask backend to create temp s3 presigned uploadURL
  const response = await fetch(
    `${API_BASE_URL}/organisation-profile/me/profile-image-upload-url`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      //send selected image's MIME type so Lambda can validate it and generate a matching S3 presigned URL
      body: JSON.stringify({
        contentType: file.type,
      }),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message ||
      "Unable to prepare the profile image upload."
    );
  }

  return body;
}

export async function uploadOrganisationProfileImage(
  file: File
): Promise<string> {

  //request temp upload url and the final s3 object key
  const {
    uploadUrl,
    profileImageKey,
  } = await getProfileImageUploadUrl(file);

  //upload the image file to S3
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(
      "Unable to upload the profile picture."
    );
  }

  // return the S3 object key so it can be saved in DynamoDB
  return profileImageKey;
}
/**
 * Function verifies that the profile is complete and able to update it's profile picture
 * Returns the complete organisation profile
 * @param file 
 * @param currentProfile 
 * @returns 
 */
export async function updateOrganisationProfileImage(
  file: File,
  currentProfile: OrganisationProfile
): Promise<OrganisationProfile> {
  const profileImageKey =
    await uploadOrganisationProfileImage(file);

  const requiredValues = {
    websiteUrl: currentProfile.websiteUrl,
    websiteDomain: currentProfile.websiteDomain,
    addressLine1: currentProfile.addressLine1,
    townCity: currentProfile.townCity,
    postcode: currentProfile.postcode,
    country: currentProfile.country,
  };

  if (
    !requiredValues.websiteUrl ||
    !requiredValues.websiteDomain ||
    !requiredValues.addressLine1 ||
    !requiredValues.townCity ||
    !requiredValues.postcode ||
    !requiredValues.country
  ) {
    throw new Error(
      "Your organisation profile is missing required information."
    );
  }

  return completeOrganisationProfile({
    websiteUrl:
      requiredValues.websiteUrl,

    websiteDomain:
      requiredValues.websiteDomain,

    profileImageKey,

    description:
      currentProfile.description ?? "",

    addressLine1:
      requiredValues.addressLine1,

    addressLine2:
      currentProfile.addressLine2,

    townCity:
      requiredValues.townCity,

    county:
      currentProfile.county,

    postcode:
      requiredValues.postcode,

    country:
      requiredValues.country,
  });
}

/**
 * Updates the user's profile description in dynamoDB
 * @param description 
 * @returns 
 */
export async function updateOrganisationDescription(
  description: string
): Promise<OrganisationProfile> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/organisation-profile/me/description`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    }
  );

  const body = await response.json().catch(() => null); //response body could cause an error, catch the error and use null instead

  if (!response.ok) {
    throw new Error(
      body?.message ||
      "Unable to update the description."
    );
  }

  return body.organisationProfile;
}

/**
 * Deletes the users account and information (petlistings, profile, s3 files, cognito user)
 */
export async function deleteOrganisationAccount(): Promise<void> {
  const token = await getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/organisation-profile/me`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const text = await response.text();

  let body: any = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(
      body?.errorMessage ||
      body?.message ||
      response.statusText ||
      "Unable to delete your shelter account."
    );
  }
}
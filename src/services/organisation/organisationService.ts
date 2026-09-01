import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Service functions and types used to manage organisation profiles.
 * Handles profile loading, updates, profile images and account deletion.
 */

// Possible review states for an organisation account
export type OrganisationStatus = "pending" | "approved" | "rejected" | "suspended";

/**
 * Response returned when requesting a temporary profile image upload URL.
 */
type ProfileImageUploadUrlResponse = {
  uploadUrl: string;
  profileImageKey: string;
};


/**
 * Stores the organisation profile returned by the backend.
 */
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

/**
 * Values required when completing an organisation profile.
 */
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


/**
 * Gets the current Cognito access token for authenticated API requests.
 */
export async function getAuthToken() {
  const session = await fetchAuthSession({ forceRefresh: true });

  const accessToken = session.tokens?.accessToken?.toString();

  if (!accessToken) {
    throw new Error("You are not signed in.");
  }

  return accessToken;
}


/**
 * Retrieves the currently signed-in organisation's profile.
 */
export async function getCurrentOrganisationProfile() {

  if (!API_BASE_URL) {
    throw new Error("API URL is not configured");
  }

  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/organisation-profile/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || "Unable to get organisation profile.");
  }

  return body.organisationProfile;
}


/**
 * Saves the organisation's completed profile information.
 * @param input Completed organisation profile values.
 */
export async function completeOrganisationProfile(
  input: CompleteOrganisationProfileInput
): Promise<OrganisationProfile> {
  if (!API_BASE_URL) {
    throw new Error("API URL is not configured");
  }

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
    throw new Error(body?.message || "Unable to complete your organisation profile.");
  }

  return body.organisationProfile;
}


/**
 * Requests a temporary S3 upload URL for a profile image.
 * @param file Image selected by the organisation.
 */
export async function getProfileImageUploadUrl(
  file: File
): Promise<ProfileImageUploadUrlResponse> {

  if (!API_BASE_URL) {
    throw new Error("API URL is not configured");
  }

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
      body: JSON.stringify({ contentType: file.type }),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || "Unable to prepare the profile image upload.");
  }

  return body;
}

/**
 * Uploads an organisation profile image to S3.
 * @param file Image selected by the organisation.
 * @returns The S3 object key for the uploaded image.
 */
export async function uploadOrganisationProfileImage(
  file: File
): Promise<string> {

  //request temp upload url and the final s3 object key
  const { uploadUrl, profileImageKey } = await getProfileImageUploadUrl(file);

  //upload the image file to S3
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Unable to upload the profile picture.");
  }

  // return the S3 object key so it can be saved in DynamoDB
  return profileImageKey;
}


/**
 * Updates an organisation's profile image while keeping
 * the rest of its existing profile information.
 * @param file New profile image.
 * @param currentProfile Current organisation profile.
 * @returns The updated organisation profile.
 */
export async function updateOrganisationProfileImage(
  file: File,
  currentProfile: OrganisationProfile
): Promise<OrganisationProfile> {
  const profileImageKey = await uploadOrganisationProfileImage(file);

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
    websiteUrl: requiredValues.websiteUrl,
    websiteDomain: requiredValues.websiteDomain,

    profileImageKey,

    description: currentProfile.description ?? "",

    addressLine1: requiredValues.addressLine1,
    addressLine2: currentProfile.addressLine2,

    townCity: requiredValues.townCity,
    county: currentProfile.county,
    postcode: requiredValues.postcode,
    country: requiredValues.country,
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

  if (!API_BASE_URL) {
    throw new Error("API URL is not configured");
  }

  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/organisation-profile/me/description`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    }
  );

  const body = await response.json().catch(() => null); //response body could cause an error, catch the error and use null instead

  if (!response.ok) {
    throw new Error(
      body?.message || "Unable to update the description.");
  }

  return body.organisationProfile;
}

/**
 * Permanently deletes the organisation account and its related data.
 */
export async function deleteOrganisationAccount(): Promise<void> {

  if (!API_BASE_URL) {
    throw new Error("API URL is not configured");
  }

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

  // Read the response as text because the endpoint may return
  // either an empty body or a JSON error response
  const text = await response.text();

  let body: any = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(
      body?.errorMessage || body?.message || response.statusText || "Unable to delete your shelter account."
    );
  }
}
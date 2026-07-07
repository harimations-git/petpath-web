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

  websiteURL?: string;
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

async function getAuthToken() {
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
import { fetchAuthSession } from "aws-amplify/auth";

export type OrganisationStatus = "pending" | "approved" | "rejected" | "suspended";

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
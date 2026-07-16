
import type { CreatePetListingRequest, GetOrganisationListingsResponse } from "../../types/listing";
import { getAuthToken } from "../organisation/organisationService";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

/*
* Gets the basic info about a file that is sent to the Lambda
* when requesting the presigned upload URLS
*/
export type ListingFileMetadata = {
    fileName: string;
    contentType: string;
    sizeBytes: number;
};

/*
 * Request sent to:
 * POST /pet-listings/upload-urls
 */
export type PrepareListingUploadsInput = {
    photos: ListingFileMetadata[];
    documents: ListingFileMetadata[];
};

/*
 * One prepared S3 upload returned by the Lambda.
 */
export type PreparedListingUpload = {
    uploadUrl: string;
    key: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
};

/*
 * Response returned by:
 * POST /pet-listings/upload-urls
 */
export type PrepareListingUploadsResponse = {
    listingId: string;
    photos: PreparedListingUpload[];
    documents: PreparedListingUpload[];
};

/*
 * Response returned after the DynamoDB listing
 * records have been successfully created.
 */
export type CreatePetListingResponse = {
    message: string;
    listingId: string;
};

/*
 * Convert browser File objects into metadata that
 * can safely be sent to the upload URL Lambda.
 *
 * The actual files are not sent through API Gateway.
 */
export function createFileMetadata(
    files: File[]
): ListingFileMetadata[] {
    return files.map((file) => ({
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
    }));
}

/*
 * Ask the backend to:
 *
 * 1. Generate a listing ID.
 * 2. Generate S3 object keys.
 * 3. Generate temporary presigned upload URLs.
 */
export async function prepareListingUploads(
    input: PrepareListingUploadsInput
): Promise<PrepareListingUploadsResponse> {
    const token = await getAuthToken();

    const response = await fetch(
        `${API_BASE_URL}/pet-listings/upload-urls`,
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${token}`,
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify(input),
        }
    );

    const body = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            body?.message ||
            "Unable to prepare the listing uploads."
        );
    }

    if (
        !body?.listingId ||
        !Array.isArray(body.photos) ||
        !Array.isArray(body.documents)
    ) {
        throw new Error(
            "The server returned an invalid upload response."
        );
    }

    return body;
}


/*
 * Upload one file directly to S3 using the
 * presigned URL returned by the Lambda.
 */
export async function uploadFileToS3(
    file: File,
    uploadUrl: string
): Promise<void> {
    const response = await fetch(
        uploadUrl,
        {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        }
    );

    if (!response.ok) {
        throw new Error(
            `Unable to upload ${file.name}.`
        );
    }
}


type UploadPreparedListingFilesInput = {
    listingPhotos: File[];
    veterinaryDocuments: File[];

    preparedUploads:
    PrepareListingUploadsResponse;
};

/*
 * Upload all listing photos and veterinary documents.
 *
 * The order of the returned URLs must match the order
 * of the files sent to the preparation endpoint.
 */
export async function uploadPreparedListingFiles({
    listingPhotos,
    veterinaryDocuments,
    preparedUploads,
}: UploadPreparedListingFilesInput): Promise<void> {
    if (
        listingPhotos.length !==
        preparedUploads.photos.length
    ) {
        throw new Error(
            "The number of prepared photo uploads does not match the selected photos."
        );
    }

    if (
        veterinaryDocuments.length !==
        preparedUploads.documents.length
    ) {
        throw new Error(
            "The number of prepared document uploads does not match the selected documents."
        );
    }

    const photoUploads =
        preparedUploads.photos.map(
            (preparedPhoto, index) =>
                uploadFileToS3(
                    listingPhotos[index],
                    preparedPhoto.uploadUrl
                )
        );

    const documentUploads =
        preparedUploads.documents.map(
            (preparedDocument, index) =>
                uploadFileToS3(
                    veterinaryDocuments[index],
                    preparedDocument.uploadUrl
                )
        );

    await Promise.all([
        ...photoUploads,
        ...documentUploads,
    ]);
}

/*
 * Send the completed listing information and uploaded
 * S3 keys to the CreatePetListing Lambda.
 */
export async function createPetListing(
    input: CreatePetListingRequest
): Promise<CreatePetListingResponse> {
    const token = await getAuthToken();

    const response = await fetch(
        `${API_BASE_URL}/pet-listings`,
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${token}`,
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify(input),
        }
    );

    const body = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            body?.message ||
            "Unable to create the pet listing."
        );
    }

    if (!body?.listingId) {
        throw new Error(
            "The server did not return the new listing ID."
        );
    }

    return body;
}

type GetOrganisationListingsOptions = {
    limit?: number;
    nextToken?: string | null;
};

/**
 * Load the currently signed in organisation's pet listings from PetPath API
 * @param param0 
 * @returns 
 */
export async function getOrganisationListings({
    limit = 12, //limit to 12 matches loading at once
    nextToken,
}: GetOrganisationListingsOptions = {}):
    Promise<GetOrganisationListingsResponse> {
    const token = await getAuthToken();

    const searchParams =
        new URLSearchParams({
            limit: String(limit),
        });

    if (nextToken) {
        searchParams.set(
            "nextToken",
            nextToken
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/pet-listings/me?${searchParams.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    const body = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            body?.message ||
            "Unable to load your pet listings."
        );
    }

    return {
        listings:
            Array.isArray(body?.listings)
                ? body.listings
                : [],

        nextToken:
            typeof body?.nextToken === "string"
                ? body.nextToken
                : null,
    };
}
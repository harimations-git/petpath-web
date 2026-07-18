import type {
    CreateListingAnimalInput,
    CreatePetListingRequest,
    GetOrganisationListingsResponse,
    ListingAvailabilityStatus,
    OrganisationListingDetails,
    UpdateOrganisationListingInput,
    UploadedListingPhoto,
    UploadedVeterinaryDocument,
} from "../../types/listing";

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

        nextToken: typeof body?.nextToken === "string"
            ? body.nextToken
            : null,
    };
}
/*
 * Loads an existing listing.
 * Prepares and uploads any newly added files.
 * Sends the updated listing information to the backend.
 *
 * Used by the View Listing page to autofill
 * the create-listing style form.
 */
export async function getOrganisationListing(
    listingId: string
): Promise<OrganisationListingDetails> {
    const token = await getAuthToken();

    const response = await fetch(
        //API request url. encodeURIComponent safely sends the ID for use in URL
        `${API_BASE_URL}/pet-listings/me/${encodeURIComponent(listingId)}`,
        {
            method: "GET",

            //Backedn checks the header to confirm user is authorised
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    const body = await response.json().catch(() => null); //if response is not valid return null instead

    if (!response.ok) {
        throw new Error(
            body?.message ||
            "Unable to load this pet listing."
        );
    }

    if (!body?.listingId) {
        throw new Error(
            "The server returned an invalid listing."
        );
    }

    return {
        ...body,

        //return empty arrays if server did not return valid arrays
        animals:
            Array.isArray(body.animals)
                ? body.animals
                : [],

        photos:
            Array.isArray(body.photos)
                ? body.photos
                : [],

        documents:
            Array.isArray(body.documents)
                ? body.documents
                : [],
    };
}


/*
 * This function asks the backend for presigned S3 upload URLs
 */
export async function prepareListingUpdateUploads(
    listingId: string,
    input: PrepareListingUploadsInput
): Promise<PrepareListingUploadsResponse> {
    const token = await getAuthToken();

    const response = await fetch(
        `${API_BASE_URL}/pet-listings/me/${encodeURIComponent(listingId)}/upload-urls`,
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        }
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            body?.message ||
            "Unable to prepare listing update uploads."
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
 * Convert form animals into the shape expected
 * by the backend update Lambda.
 */
function createListingAnimalInputs(
    animals: UpdateOrganisationListingInput["animals"]
): CreateListingAnimalInput[] {

    //Check every animal
    return animals.map((animal, index) => {
        if (
            !animal.name ||
            !animal.animalType ||
            !animal.breedSpecies ||
            !animal.sex ||
            !animal.ageText
        ) {
            throw new Error(
                `Please complete all required details for animal ${index + 1}.`
            );
        }

        return {
            animalId: animal.id,
            name: animal.name,

            animalType: animal.animalType,
            breedSpecies: animal.breedSpecies,

            sex: animal.sex,
            ageText: animal.ageText,

            temperament: animal.temperament,

            animalOrder: index,
        };
    });
}


/*
 * Save changes to an existing listing.
 * Function prepares the upload urls for any of the new files
 * Uploads the new files to s3 and then sends the updated listing 
 * fields to s3 keys to the API
 */
export async function updateOrganisationListing(
    input: UpdateOrganisationListingInput
): Promise<CreatePetListingResponse> {

    //extract input fields
    const {
        listingId,

        title,
        listingType,
        animalType,
        numberOfAnimals,

        description,
        listingUrl,
        adoptionFee,

        vaccinationStatus,
        microchipStatus,
        neuteredStatus,
        healthNotes,

        matchingProfile,
        animals,

        existingPhotoKeys,
        removedPhotoKeys,
        newPhotos,

        existingDocumentKeys,
        removedDocumentKeys,
        newDocuments,
    } = input;

    //request upload urls
    const preparedUploads =
        await prepareListingUpdateUploads(
            listingId,
            {
                /**
                 * createFileMetadata() gives the backend enough information 
                 * to prepare a secure upload location without sending the large file 
                 * itself through your API and Lambda.
                */
                photos: createFileMetadata(newPhotos),
                documents: createFileMetadata(newDocuments),
            }
        );


    //the actual files are uploaded here
    await uploadPreparedListingFiles({
        listingPhotos: newPhotos,
        veterinaryDocuments: newDocuments,
        preparedUploads,
    });

    //converts the s3 upload information into the file objects 
    const uploadedNewPhotos: UploadedListingPhoto[] =
        preparedUploads.photos.map( // Go through each prepared photo and create a new UploadedListingPhoto object
            (photo, index) => ({
                key: photo.key,
                fileName: photo.fileName,

                contentType: photo.contentType,
                sizeBytes: photo.sizeBytes,

                photoOrder:
                    existingPhotoKeys.length +
                    index,
            })
        );

    //Same as uploadedNewPhotos but for newly uploaded vet documents
    const uploadedNewDocuments: UploadedVeterinaryDocument[] =
        preparedUploads.documents.map(
            (document) => ({
                key: document.key,
                fileName: document.fileName,

                contentType: document.contentType,
                sizeBytes: document.sizeBytes,
            })
        );

    const token = await getAuthToken();

    const response = await fetch(
        `${API_BASE_URL}/pet-listings/me/${encodeURIComponent(listingId)}`,
        {
            method: "PUT",
            headers: {
                Authorization:
                    `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                listingId,
                title,

                listingType,
                animalType,
                numberOfAnimals,

                description,
                enquiryUrl: listingUrl,
                adoptionFee,

                vaccinationStatus,
                microchipStatus,
                neuteredStatus,
                healthNotes,

                matchingProfile,
                animals: createListingAnimalInputs(animals),

                existingPhotoKeys,
                removedPhotoKeys,
                newPhotos: uploadedNewPhotos,

                existingDocumentKeys,
                removedDocumentKeys,
                newDocuments: uploadedNewDocuments,
            }),
        }
    );

    const body = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            body?.message ||
            "Unable to update the pet listing."
        );
    }

    return {
        message: body?.message || "Listing updated successfully.",
        listingId: body?.listingId || listingId,
    };
}

/**
 * Update the availability status of a pet to either
 * - Available
 * - Reserved
 * - Rehomed
 * @param listingId 
 * @param availabilityStatus 
 */
export async function updateListingAvailability(
    listingId: string,
    availabilityStatus: ListingAvailabilityStatus
): Promise<void> {
    const token = await getAuthToken();

    const response = await fetch(
        `${API_BASE_URL}/pet-listings/me/${encodeURIComponent(
            listingId
        )}/availability`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                availabilityStatus,
            }),
        }
    );

    const body =
        await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            body?.message ||
            "Unable to update listing availability."
        );
    }
}

/**
 * Delete a single pet listing
 * @param listingId 
 */
export async function deleteOrganisationListing(
    listingId: string
): Promise<void> {
    const token = await getAuthToken();

    const response = await fetch(
        `${API_BASE_URL}/pet-listings/me/${encodeURIComponent(listingId)}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            body?.message ||
                "Unable to delete this listing."
        );
    }
}
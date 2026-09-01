/**
 * List of allowed image types
 */
export const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

/**
 * Used to check if a image is the correct type and size
 */
type ValidateImageOptions = {
    allowedTypes?: readonly string[];
    maxSizeMb?: number;
};
/**
 * Helper function to easily validate the file type and size
 * @param file 
 * @param param1 
 */
export function validateImageFile(
    file: File,
    {
        allowedTypes = allowedImageTypes,
        maxSizeMb = 5,
    }: ValidateImageOptions = {}
): string | null {
    if (!allowedTypes.includes(file.type)) {
        return "Please select a JPG, PNG or WEBP image.";
    }

    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maxSizeBytes) {
        return `The image must be smaller than ${maxSizeMb}MB.`;
    }

    return null;
}


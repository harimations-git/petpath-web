export const DEFAULT_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

type ValidateImageOptions = {
    allowedTypes?: readonly string[];
    maxSizeMb?: number;
};
/**
 * Helper function to easily validate the file type and size
 * @param file 
 * @param param1 
 * @returns 
 */
export function validateImageFile(
    file: File,
    {
        allowedTypes = DEFAULT_IMAGE_TYPES,
        maxSizeMb = 5,
    }: ValidateImageOptions = {}
): string | null {
    if (!allowedTypes.includes(file.type)) {
        return "Please select a JPG, PNG or WEBP image.";
    }

    const maxSizeBytes =
        maxSizeMb * 1024 * 1024;

    if (file.size > maxSizeBytes) {
        return `The image must be smaller than ${maxSizeMb}MB.`;
    }

    return null;
}
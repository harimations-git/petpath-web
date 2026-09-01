
/**
 * Function takes a URL or domain entered by the user and returns only the domain name.
 * @param value 
 */
export function getDomainFromUrl(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return "";
    }

    try {
        const formattedUrl =
            trimmedValue.startsWith("http://") ||
            trimmedValue.startsWith("https://")
                ? trimmedValue
                : `https://${trimmedValue}`;

        return new URL(formattedUrl)
            .hostname
            .toLowerCase()
            .replace(/^www\./, "");
    } catch {
        return "";
    }
}

/**
 * Function makes sure a URL starts with either http:// or https://.
 * @param value 
 */
export function normaliseUrl(value: string) {
    const trimmedValue = value.trim();

    if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")
    ) {
        return trimmedValue;
    }

    return `https://${trimmedValue}`;
}
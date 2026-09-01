/**
 * Function turns an iso date into a readable format
 * @param dateValue 
 */
export function formatDate(
    dateValue: string
) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(date);
}

/**
 * Function displays the oldest listing's date in a readable format
 * @param dateValue 
 */
export function formatOldestWaiting(
    dateValue: string | null
) {
    if (!dateValue) {
        return "None";
    }

    const submittedDate = new Date(dateValue);

    const difference = Date.now() - submittedDate.getTime();

    const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));

    if (days === 0) {
        return "Today";
    }

    if (days === 1) {
        return "1 day";
    }

    return `${days} days`;
}

/**
 * Function turns text like
 * c_at into Cat
 * @param animalType 
 */
export function formatDisplayValue(animalType: string) {
    return animalType
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}

/*
 * Creates initials from a given name to display 
 */
export function getInitials(name: string) {
    const words = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "PP";
    }

    if (words.length === 1) {
        return words[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`
        .toUpperCase();
}

/**
 * Helper function to make the adoption fee of an animal readable
 * E.g. 50 => £50.00 || 25.5 => £25.50
 * @param adoptionFee 
 * @returns 
 */
export function formatAdoptionFee(adoptionFee?: number | string | null) {
    if (adoptionFee === null || adoptionFee === undefined || adoptionFee === "") {
        return "Not provided";
    }

    const numericFee = Number(adoptionFee);

    if (Number.isNaN(numericFee)) {
        return String(adoptionFee);
    }

    if (numericFee === 0) {
        return "No adoption fee";
    }

    return new Intl.NumberFormat(
        "en-GB",
        {
            style: "currency",
            currency: "GBP",
        }
    ).format(numericFee);
}

/**
 * Helper function takes parts of a location, removes any missing values 
 * and joins the parts with commas
 * e.g. 
 * 
 * ["Belfast", "County Antrim", "Northern Ireland"] 
 * 
 * becomes
 * 
 * Belfast, County Antrim, Northern Ireland
 * 
 * @param values 
 * @returns 
 */
export function formatLocation(values: Array<string | undefined>) {
    const location = values.filter(Boolean).join(", ");
    return location || "Not provided";
}

/**
 * Formats a matching profile value into a readable value for display.
 * Handles missing values, arrays and boolean values.
 * e.g. 
 * true -> "yes"
 * ["dogs", "small_animals"] -> "Dogs, Small Animals"
 * @param value
 */
export function formatMatchingValue(
    value: string | string[] | number | boolean | null | undefined
) {
    if (value === null || value === undefined || value === "") {
        return "Not provided";
    }

    if (Array.isArray(value)) {
        return value.map(formatDisplayValue).join(", ");
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return formatDisplayValue(String(value));
}
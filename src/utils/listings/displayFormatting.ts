/**
 * Function turns an iso date into a readable format
 * @param dateValue 
 * @returns 
 */
export function formatDashboardDate(
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
 * @returns 
 */
export function formatOldestWaiting(
    dateValue: string | null
) {
    if (!dateValue) {
        return "None";
    }

    const submittedDate = new Date(dateValue);

    const difference = Date.now() - submittedDate.getTime();

    const days = Math.max(0, Math.floor(difference /(1000 * 60 * 60 * 24)));

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
 * @returns 
 */
export function formatDisplayValue(
    animalType: string
) {
    return animalType
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
}

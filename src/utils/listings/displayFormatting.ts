/**
 * Function turns an iso date into a readable format
 * @param dateValue 
 * @returns 
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

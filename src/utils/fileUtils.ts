/**
 * Used to check if a file has already been added
 * @param file Creates a string using the file name/size and lastModified
 * @returns something like "dog-photo.webp-245632-1783428912000"
 * 
 */
export function getFileKey(file: File){
    return `${file.name}-${file.size}-${file.lastModified}`;
}

/**
 * Converts bytes into kilobytes or megabytes. Useful to display a readable size
 * @param sizeInBytes 
 * @returns something like 847 KB or 3.2 MB
 */
export function formatFileSize(sizeInBytes: number){
    if(sizeInBytes < 1024 * 1024){ //files smaller than a MB
        return `${Math.ceil(sizeInBytes / 1024)} KB`; //round the result upwards for a whole number
    }

    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Used to check the file type is a pdf
 * @param file 
 * @returns true or false
 */
export function isPdf(file: File){
    return(
        file.type === "application/pdf"
    );
}
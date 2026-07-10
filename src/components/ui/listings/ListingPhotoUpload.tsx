import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
} from "react";

import {
    ImagePlus,
    UploadCloud,
    X,
} from "lucide-react";

import "./ListingPhotoUpload.css";

import {
    getFileKey,
} from "../../../utils/fileUtils";

type ListingPhotoUploadProps = {
    photos: File[];
    onChange: (photos: File[]) => void;
    sectionNumber?: number;
    maxPhotos?: number;
    maxFileSizeMb?: number;
};

const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp", //I think these work on mobile
];

export default function ListingPhotoUpload({
    photos,
    onChange,
    sectionNumber = 3,
    maxPhotos = 5,
    maxFileSizeMb = 10,
}: ListingPhotoUploadProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);

    const [photoError, setPhotoError] = useState("");

    const maxFileSize = maxFileSizeMb * 1024 * 1024;

    /*
    * Temp. local URLs so selected files can
    * be displayed before they are uploaded.
    */
    const photoPreviews = useMemo(() => {
        return photos.map((photo) => ({
            file: photo,
            previewUrl: URL.createObjectURL(photo)
        }));
    }, [photos])

    /*
     * Remove temporary browser URLs whenever the selected
     * files change or the component unmounts.
     */
    useEffect(() => {
        return () => {
            photoPreviews.forEach(
                ({ previewUrl }) => {
                    URL.revokeObjectURL(previewUrl);
                }
            );
        };
    }, [photoPreviews]);

    const remainingPhotoSpaces = Math.max(maxPhotos - photos.length, 0);

    function openFilePicker() {
        if (photos.length >= maxPhotos) {
            setPhotoError(
                `You can only upload a maximum of ${maxPhotos} photos.`
            );

            return;
        }

        inputRef.current?.click();
    }

    function addPhotos(
        selectedFiles: File[]
    ) {
        setPhotoError("");

        if (selectedFiles.length === 0) {
            return;
        }

        const errors: string[] = [];

        const validFiles = selectedFiles.filter((file) => {
            if (
                !allowedImageTypes.includes(
                    file.type
                )
            ) {
                errors.push(
                    `${file.name} is not a support image type`
                );

                return false;
            }

            if (file.size > maxFileSize) {
                errors.push(
                    `${file.name} is larger that ${maxFileSizeMb}MB.`
                );

                return false;
            }

            return true;
        });

        /*
        * Prevent the same file from being added twice.
        */
        const existingFileKeys = new Set(
            photos.map(getFileKey)
        );

        const uniqueFiles = validFiles.filter((file) => {
            const key = getFileKey(file);

            if (existingFileKeys.has(key)) {
                errors.push(
                    `${file.name} has already been added`
                );

                return false;
            }

            existingFileKeys.add(key);

            return true;
        });

        const availableSpaces = maxPhotos - photos.length;

        const acceptedFiles = uniqueFiles.slice(0, availableSpaces);

        if (uniqueFiles.length > availableSpaces) {
            errors.push(`Only ${maxPhotos} photos can be uploaded`);
        }

        if (acceptedFiles.length > 0) {
            onChange([
                ...photos,
                ...acceptedFiles,
            ]);
        }

        if (errors.length > 0) {
            setPhotoError(errors[0]);
        }
    }

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const selectedFiles = Array.from(event.target.files ?? []);

        addPhotos(selectedFiles);

        /**
         * Reset the input so a removed file can be selected again later
         */
        event.target.value = "";
    }
    function handleDragOver(
        event: DragEvent<HTMLButtonElement>
    ) {
        event.preventDefault();

        if (photos.length < maxPhotos) {
            setIsDragging(true);
        }
    }

    function handleDragLeave() {
        setIsDragging(false);
    }

    function handleDrop(
        event: DragEvent<HTMLButtonElement>
    ) {
        event.preventDefault();
        setIsDragging(false);

        if (photos.length >= maxPhotos) {
            setPhotoError(
                `You can upload a maximum of ${maxPhotos} photos.`
            );

            return;
        }

        addPhotos(
            Array.from(
                event.dataTransfer.files
            )
        );
    }

    function removePhoto(
        photoIndex: number
    ) {
        onChange(
            photos.filter(
                (_, index) =>
                    index !== photoIndex
            )
        );

        setPhotoError("");
    }
    return (
        <section className="create-listing-section listing-photos-section">
            <div className="listing-photos-heading">
                <div>
                    <h2>
                        {sectionNumber}. Listing
                        photos
                    </h2>

                    <p>
                        Upload shared photos that
                        represent the animals in
                        this listing.
                    </p>
                </div>

                <span className="listing-photo-count">
                    {photos.length}/{maxPhotos}
                </span>
            </div>

            <input
                ref={inputRef}
                className="listing-photo-input"
                type="file"
                accept={allowedImageTypes.join(
                    ","
                )}
                multiple
                onChange={handleInputChange}
            />

            <div className="listing-photo-grid">
                <button
                    type="button"
                    className={`listing-photo-dropzone ${isDragging
                        ? "listing-photo-dropzone-active"
                        : ""
                        }`}
                    onClick={openFilePicker}
                    onDragOver={
                        handleDragOver
                    }
                    onDragLeave={
                        handleDragLeave
                    }
                    onDrop={handleDrop}
                    disabled={
                        photos.length >=
                        maxPhotos
                    }
                >
                    <UploadCloud
                        size={34}
                        aria-hidden="true"
                    />

                    <strong>
                        {photos.length >=
                            maxPhotos
                            ? "Maximum photos added"
                            : "Drag and drop photos here"}
                    </strong>

                    {photos.length <
                        maxPhotos && (
                            <span>
                                or click to browse
                            </span>
                        )}

                    <small>
                        JPG, PNG or WEBP · Max{" "}
                        {maxFileSizeMb}MB each
                    </small>
                </button>

                {photoPreviews.map(
                    (
                        {
                            file,
                            previewUrl,
                        },
                        index
                    ) => (
                        <article
                            key={getFileKey(
                                file
                            )}
                            className="listing-photo-preview"
                        >
                            <img
                                src={
                                    previewUrl
                                }
                                alt={`Listing photo ${index + 1
                                    }`}
                            />

                            {index === 0 && (
                                <span className="listing-photo-primary">
                                    Cover photo
                                </span>
                            )}

                            <button
                                type="button"
                                className="listing-photo-remove"
                                onClick={() =>
                                    removePhoto(
                                        index
                                    )
                                }
                                aria-label={`Remove ${file.name}`}
                            >
                                <X
                                    size={15}
                                />
                            </button>
                        </article>
                    )
                )}

                {Array.from({
                    length:
                        remainingPhotoSpaces,
                }).map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className="listing-photo-placeholder"
                        onClick={
                            openFilePicker
                        }
                    >
                        <ImagePlus
                            size={29}
                            aria-hidden="true"
                        />

                        <span>Add photo</span>

                        <small>
                            {photos.length === 0 && index === 0
                                ? "Required"
                                : "Optional"}
                        </small>

                    </button>
                ))}
            </div>

            {photoError && (
                <p
                    className="listing-photo-error"
                    role="alert"
                >
                    {photoError}
                </p>
            )}

            <p className="listing-photo-help">
                The first photo will be used as the
                main cover image for the listing.
            </p>
        </section>
    );
}
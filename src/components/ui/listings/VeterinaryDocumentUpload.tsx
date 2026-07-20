import {
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
} from "react";

import {
    ChevronDown,
    ChevronUp,
    FileText,
    Upload,
    X,
} from "lucide-react";

import {
    formatFileSize,
    getFileKey,
    isPdf,
} from "../../../utils/fileUtils";

import type {
    ExistingListingDocument,
} from "../../../types/listing";

import "./VeterinaryDocumentUpload.css";

type VeterinaryDocumentUploadProps = {
    documents: File[];
    onChange: (documents: File[]) => void;

    existingDocuments?: ExistingListingDocument[];
    onRemoveExistingDocument?: (
        documentKey: string
    ) => void;

    maxFiles?: number;
    maxFileSizeMb?: number;
    required?: boolean;
};

export default function VeterinaryDocumentUpload({
    documents,
    onChange,
    existingDocuments = [],
    onRemoveExistingDocument,

    maxFiles = 10,
    maxFileSizeMb = 10,
    required = true,
}: VeterinaryDocumentUploadProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

    const totalDocumentCount = existingDocuments.length + documents.length;

    const recentDocuments = documents.slice(-2);
    const displayDocuments = showAllFiles ? documents : recentDocuments;

    const hiddenDocumentCount = Math.max(documents.length - recentDocuments.length, 0);

    function openFilePicker() {
        if (totalDocumentCount >= maxFiles) {
            setUploadError(`You can only upload a maximum of ${maxFiles} veterinary documents.`);
            return
        }

        inputRef.current?.click();
    }

    function addDocuments(selectedFiles: File[]) {
        setUploadError("");

        if (selectedFiles.length === 0) {
            return;
        }

        const errors: string[] = [];

        const existingFileKeys = new Set(documents.map(getFileKey));

        const validFiles = selectedFiles.filter((file) => {
            if (!isPdf(file)) {
                errors.push(`${file.name} is not a PDF file.`);
                return false;
            }

            if (file.size > maxFileSizeBytes) {
                errors.push(`${file.name} is larger than ${maxFileSizeMb}MB.`);
                return false;
            }

            const fileKey = getFileKey(file);

            if (existingFileKeys.has(fileKey)) {
                errors.push(`${file.name} has already been added`);
                return false;
            }

            existingFileKeys.add(fileKey);

            return true;
        });

        const availableSpaces = maxFiles - totalDocumentCount;

        const acceptedFiles = validFiles.slice(0, availableSpaces);

        //checks if the user selected more valid files than there is space for
        if (validFiles.length > availableSpaces) {
            errors.push(`Only ${maxFiles} veterinary documents can be uploaded`);
        }

        //creates a new array containing all the docs uploaded and the newly accepted files
        if (acceptedFiles.length > 0) {
            onChange([
                ...documents,
                ...acceptedFiles
            ]);
        }

        if (errors.length > 0) {
            setUploadError(errors[0])
        }
    }

    /**
     * Convert selected files into an array and send them to be validated.
     * @param event 
     */
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        addDocuments(
            Array.from(event.target.files ?? []) //use selected files or empty array
        );

        event.target.value = ""; //clear file input after processing
    }

    /**
     * Allows files to be dropped here. Checks thhe upload limit has not been reached
     * @param event 
     */
    function handleDragOver(event: DragEvent<HTMLButtonElement>) {
        event.preventDefault(); //dropping a file might cause the browser to open the file instead of uploading it

        if (totalDocumentCount < maxFiles) { //checks for free space
            setIsDragging(true);
        }
    }

    function handleDragLeave() {
        setIsDragging(false);
    }

    /**
     * Convert dropped files into an array and process themi
     * @param event 
     */
    function handleDrop(event: DragEvent<HTMLButtonElement>) {
        event.preventDefault();
        setIsDragging(false);

        addDocuments(Array.from(event.dataTransfer.files));
    }

    /**
     * Remove one selected file from the documents array
     * @param documentToRemove 
     */
    function removeDocument(documentToRemove: File) {
        const removeKey = getFileKey(documentToRemove); //get the unique key for the file being removed

        //Filter keeps the document whose key does not match the removed file's key
        const updatedDocuments = documents.filter((document) => getFileKey(document) !== removeKey);

        onChange(updatedDocuments);
        setUploadError("");

        if (updatedDocuments.length <= 2) {
            setShowAllFiles(false); //hide the expanded files view
        }
    }

    return (
        <div className="vet-document-upload">
            <div className="vet-document-upload-header">
                <div>
                    <span className="vet-document-upload-label">
                        Upload veterinary documents (PDF)

                        {required && (
                            <strong>*</strong>
                        )}
                    </span>
                    <p>
                        Upload vaccination records, health checks or other supporting documents.
                    </p>
                </div>

            </div>

            <input
                ref={inputRef}
                className="vet-document-input"
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleInputChange}
            />

            <div className="vet-document-content">
                <button
                    type="button"
                    className={`vet-document-dropzone ${isDragging ? "vet-document-dropzone-active" : ""}`}
                    onClick={openFilePicker}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    disabled={totalDocumentCount >= maxFiles}
                >
                    <Upload
                        size={25}
                    />

                    <strong>
                        {totalDocumentCount >= maxFiles ? "Maximum files uploaded" : "Drag and drop PDF files here"}
                    </strong>

                    {totalDocumentCount < maxFiles && (
                        <span>or click to browse</span>
                    )}

                    <small>
                        PDF only · Max {maxFileSizeMb}MB each
                    </small>
                </button>

                <div className="vet-document-list-column">
                    <div className="vet-document-list-heading">
                        <span>Uploaded files</span>

                        <span>
                            {totalDocumentCount}/{maxFiles}
                        </span>
                    </div>

                    {totalDocumentCount === 0 ? (
                        <div className="vet-document-empty">
                            No documents uploaded yet
                        </div>
                    ) : (
                        <>
                            <div className="vet-document-list">
                                {existingDocuments.map((document) => (
                                    <article
                                        key={document.key}
                                        className="vet-document-item"
                                    >
                                        <div className="vet-document-icon">
                                            <FileText size={18} />
                                        </div>

                                        <div className="vet-document-details">
                                            <strong title={document.fileName}>
                                                {document.fileName}
                                            </strong>

                                            <small>
                                                Existing document
                                            </small>
                                        </div>

                                        <button
                                            type="button"
                                            className="vet-document-remove"
                                            onClick={() =>
                                                onRemoveExistingDocument?.(
                                                    document.key
                                                )
                                            }
                                        >
                                            <X size={15} />
                                        </button>
                                    </article>
                                ))}



                                {displayDocuments.map((document) => (
                                    <article
                                        key={getFileKey(document)}
                                        className="vet-document-item"
                                    >
                                        <div className="vet-document-icon">
                                            <FileText
                                                size={18}
                                            />
                                        </div>

                                        <div className="vet-document-details">
                                            <strong title={document.name}>
                                                {document.name}
                                            </strong>

                                            <small>
                                                {formatFileSize(document.size)}
                                            </small>
                                        </div>

                                        <button
                                            type="button"
                                            className="vet-document-remove"
                                            onClick={() => removeDocument(document)}
                                        >
                                            <X size={15} />
                                        </button>
                                    </article>
                                ))}
                            </div>

                            {showAllFiles && documents.length > 2 && (
                                <button
                                    type="button"
                                    className="vet-document-collapse"
                                    onClick={() => setShowAllFiles(false)}
                                >
                                    Show only recent files

                                    <ChevronUp
                                        size={16} />
                                </button>
                            )}

                            {!showAllFiles && hiddenDocumentCount > 0 && (
                                <button
                                    type="button"
                                    className="vet-document-hidden-count"
                                    onClick={() => setShowAllFiles(true)}
                                >
                                    <span>
                                        +{hiddenDocumentCount} earlier{" "} {hiddenDocumentCount === 1 ? "file" : "files"}
                                    </span>

                                    <ChevronDown
                                        size={16} />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            {uploadError && (
                <p
                    className="vet-document-error"
                    role="alert"
                >
                    {uploadError}
                </p>
            )}
        </div>
    )

}
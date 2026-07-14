import { useRef, type ChangeEvent } from "react";
import { ImageUp, User } from "lucide-react";

import Card from "../Card";

import "./ProfilePictureCard.css";
import Spacer from "../../layout/Spacer";

type ProfilePictureCardProps = {
    imageUrl?: string;
    organisationName?: string;
    onChangeImage: (file: File) => void;
    isDisabled?: boolean;
};

const PROFILE_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function ProfilePictureCard({
    imageUrl,
    organisationName = "Shelter",
    onChangeImage,
    isDisabled = false,
}: ProfilePictureCardProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    //Open file explorer. Returns if disabled
    function openFilePicker() {
        if (isDisabled) return;
        inputRef.current?.click();
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        onChangeImage(file);

        // lets the user re-select the same image later if needed
        event.target.value = "";
    }


    return (
        <Card className="profile-picture-card">
            <div className="profile-picture-card-heading">
                <span className="profile-picture-card-icon">
                    <User size={18} />
                </span>

                <div>
                    <h2>Profile picture</h2>
                    <p>This photo represents your shelter</p>
                </div>
            </div>

            <div className="profile-picture-card-body">
                <div className="profile-picture-preview">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`${organisationName} profile`}
                        />
                    ) : (
                        <div className="profile-picture-placeholder">
                            <User size={40} />
                        </div>
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept= {PROFILE_IMAGE_TYPES.join(",")}
                    className="profile-picture-hidden-input"
                    onChange={handleInputChange}
                    disabled={isDisabled}
                />
                <button
                    type="button"
                    className="profile-picture-change-button"
                    onClick={openFilePicker}
                    disabled={isDisabled}
                >
                    <ImageUp size={17} />
                    {imageUrl ? "Change profile picture" : "Upload profile picture"}
                </button>
            </div>
            <Spacer height={5}/>
        </Card >
    )
}
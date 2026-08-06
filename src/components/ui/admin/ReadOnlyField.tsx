import type { ReactNode } from "react";

type ReadOnlyFieldProps = {
    label: string;
    value?: ReactNode;
    fullWidth?: boolean;
};

export default function ReadOnlyField({
    label,
    value,
    fullWidth = false,
}: ReadOnlyFieldProps) {
    const hasValue = value !== undefined && value !== null && value !== "";

    return (
        <div
            className={["admin-listing-review-field", fullWidth ? "admin-listing-review-field-full" : ""]
                .join(" ")}
        >
            <span>{label}</span>

            <div className="admin-listing-review-field-value">
                {hasValue
                    ? value
                    : "Not provided"}
            </div>
        </div>
    );
}
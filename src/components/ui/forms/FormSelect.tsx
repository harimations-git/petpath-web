import {
    useId,
    type ChangeEvent,
    type ReactNode,
} from "react";

import "./FormSelect.css";

export type FormSelectOption = {
    label: string;
    value: string;
};

type FormSelectProps = {
    label: string;
    value: string;
    options: readonly FormSelectOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    id?: string;
    name?: string;
    error?: string;
};

export default function FormSelect({
    label,
    value,
    options,
    onChange,
    placeholder = "Select an option",
    helperText,
    required = false,
    disabled = false,
    icon,
    id,
    name,
    error,
}: FormSelectProps) {
    const generatedId = useId();
    const selectId = id ?? name ?? generatedId;

    function handleChange(event: ChangeEvent<HTMLSelectElement>) {
        onChange(event.target.value);
    }

    return (
        <label
            className={`form-select-field ${error ? "form-select-field-error" : ""}`}
            htmlFor={selectId} //connects the label to the element whose id matches selectId
        >
            <span className="form-select-label">
                {icon && (
                    <span
                        className="form-select-label-icon"
                    >
                        {icon}
                    </span>
                )}
                <span>
                    {label}

                    {required && (
                        <strong>*</strong>
                    )}
                </span>
            </span>

            <select
                id={selectId}
                name={name}
                value={value}
                onChange={handleChange}
                required={required}
                disabled={disabled}
            >
                <option value="" disabled>{placeholder}</option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {error ? (
                <small className="form-select-error">
                    {error}
                </small>
            ) : helperText ? (
                <small>{helperText}</small>
            ) : null}
        </label>
    )
}

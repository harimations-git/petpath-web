type SelectOption = {
    label: string;
    value: string;
};

type FormSelectProps = {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;

    placeholder?: string;
    required?: boolean;
    helpText?: string;
};

export default function FormSelect({
    label,
    value,
    options,
    onChange,
    placeholder = "Select option",
    required = false,
    helpText,
}: FormSelectProps) {
    return (
        <label className="create-listing-field">
            <span>
                {label}

                {required && (
                    <strong>*</strong>
                )}
            </span>

            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                required={required}
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {helpText && (
                <small>{helpText}</small>
            )}
        </label>
    );
}
import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

import { Check, ChevronDown } from "lucide-react";

import "./FilterDropdown.css";

export type FilterOption = {
    label: string;
    value: string;
}

type FilterDropdownProps = {
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    icon?: ReactNode;
    className?: string;
};

export default function FilterDropdown({
    value, options, onChange, icon, className = "",
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const selectedOption = options.find((option) => option.value === value) ?? options[0];

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (
                dropdownRef.current && !dropdownRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    function handleSelect(optionValue: string) {
        onChange(optionValue);
        setIsOpen(false);
    }

    return (
        <div
            ref={dropdownRef}
            className={`filter-dropdown ${className}`}>
            <button
                type="button"
                className="filter-dropdown-trigger"
                onClick={() =>
                    setIsOpen((current) => !current)
                }
            >
                {icon && (
                    <span className="filter-dropdown-icon">
                        {icon}
                    </span>
                )}

                <span className="filter-dropdown-label">
                    {selectedOption.label}
                </span>

                <ChevronDown
                    size={17}
                    className={`filter-dropdown-chevron ${isOpen ? "filter-dropdown-chevron-open" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div
                    className="filter-dropdown-menu"
                    role="listbox"
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                className={`filter-dropdown-option ${isSelected
                                        ? "filter-dropdown-option-selected" : ""
                                    }`}
                                onClick={() =>
                                    handleSelect(option.value)
                                }
                            >
                                <span>{option.label}</span>

                                {isSelected && (
                                    <Check size={16} />
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
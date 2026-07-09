import { Search, X } from "lucide-react";

import "./SearchBar.css";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showClearButton?: boolean;
    className?: string;
};

export default function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
    showClearButton = true,
    className = "",
}: SearchBarProps) {
    return (
        <div className={`search-bar ${className}`}>
            <Search
                className="search-bar-icon"
                size={18}
            />

            <input
                type="search"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />

            {showClearButton && value && (
                <button
                type="button"
                className="search-bar-clear"
                onClick={() => onChange("")}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
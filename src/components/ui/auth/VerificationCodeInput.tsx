import { useEffect, useRef } from "react";
import "./VerificationCodeInput.css";

type VerificationCodeInputProps = {
    length?: number;
    value: string;
    onChangeText: (code: string) => void;
    className?: string;
    disabled?: boolean;
    autoFocus?: boolean;
};

export default function VerificationCodeInput({
    length = 6,
    value,
    onChangeText,
    className = "",
    disabled = false,
    autoFocus = false,
}: VerificationCodeInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const digits = Array.from({ length }, (_, index) => value[index] || "");

    //If autofocus is on, it focuses the hidden input automatically
    useEffect(() => {
        if (autoFocus) {
            inputRef.current?.focus();
        }

    }, [autoFocus]);


    //When the user clicks anywhere on the verification boxes, this focuses the hidden input
    function focusInput() { 
        if (disabled) return;

        inputRef.current?.blur();

        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    }

    //Only allows numbers 
    function handleChange(text: string) {
        const numbersOnly = text.replace(/[^0-9]/g, "").slice(0, length);
        onChangeText(numbersOnly);
    }

    return (
        <div
            className={`verification-code-input ${className}`}
            onClick={focusInput}
            role="button"
            tabIndex={0}
            //If user presses enter or space it focuses the input too
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    focusInput();
                }
            }}
        >
            <div className="verification-code-row">
                {digits.map((digit, index) => {
                    const isActive = !disabled && (value.length === index || (value.length === length && index === length - 1));

                    return (
                        <div
                            key={index}
                            className={`verification-code-box ${isActive ? "active" : ""}`}
                        >
                            <span className="verification-code-digit">{digit}</span>
                        </div>
                    );
                })}
            </div>
            <input
                ref={inputRef}
                className="verification-code-hidden-input"
                value={value}
                onChange={(event) => handleChange(event.target.value)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={length}
                autoComplete="one-time-code" //Helps browsers/mobile devices suggest verification codes from email/texts
                aria-label="Verification code"
                disabled={disabled}
            />
        </div>
    )
}
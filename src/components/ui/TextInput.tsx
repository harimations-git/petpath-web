import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./TextInput.css";

type TextInputProps = {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  icon?: ReactNode;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export default function TextInput({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  required = false,
  onChange,
}: TextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && isPasswordVisible ? "text" : type;

  return (
    <div className="text-input-wrapper">
      <div className="text-input-icon">{icon}</div>

      <label className="text-input-content">
        <span>{label}</span>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
        />
      </label>

      {isPassword && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setIsPasswordVisible((current) => !current)}
        >
          {isPasswordVisible ? <Eye size={22} /> : <EyeOff size={22} />}
        </button>
      )}
    </div>
  );
}
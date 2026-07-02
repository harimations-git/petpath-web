import type { ButtonHTMLAttributes, ReactNode } from "react";
import { PawPrint } from "lucide-react";
import "./CustomButton.css";

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon?: ReactNode;
  fullWidth?: boolean;
};

export default function CustomButton({
  label,
  icon,
  fullWidth = true,
  className = "",
  ...props
}: CustomButtonProps) {
  return (
    <button
      className={`custom-button ${fullWidth ? "custom-button-full" : ""} ${className}`}
      {...props}
    >
      <span className="custom-button-icon">
        {icon ?? <PawPrint size={25} fill="white" />}
      </span>

      <span className="custom-button-label">{label}</span>
    </button>
  );
}
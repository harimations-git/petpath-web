import { PawPrint } from "lucide-react";
import "./Logo.css";

type LogoProps = {
  hasTagline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Logo({
  hasTagline = true,
  size = "md",
  className = "",
}: LogoProps) {
  return (
    <div className={`logo logo-${size} ${className}`}>
      <div className="logo-row">
        <PawPrint className="logo-icon" />
        <span className="logo-text">PetPath</span>
      </div>

      {hasTagline && (
        <p className="logo-tagline">More love for more homes</p>
      )}
    </div>
  );
}
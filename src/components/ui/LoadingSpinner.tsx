import "./LoadingSpinner.css";

type LoadingSpinnerProps = {
  size?: "small" | "medium" | "large" | "xl";
  fullScreen?: boolean;
  label?: string;
  className?: string;
};

export default function LoadingSpinner({
  size = "large",
  fullScreen = false,
  label,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={[
        fullScreen ? "loading-spinner-fullscreen" : "loading-spinner-container",
        className,
      ].join(" ")}
    >
      <div className={`loading-spinner loading-spinner-${size}`} />

      {label && <p className="loading-spinner-label">{label}</p>}
    </div>
  );
}
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { Info, type LucideIcon } from "lucide-react";
import "./InfoModal.css";

type InfoModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  warning?: string;
  buttonText?: string;
  buttonTextSecondary?: string;
  icon?: LucideIcon;
  onConfirm?: () => void;
  onClose?: () => void;
  primaryButtonStyle?: CSSProperties;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;

  confirmDisabled?: boolean;
  isLoading?: boolean;

  children?: ReactNode;
};

export default function InfoModal({
  visible,
  title,
  message,
  warning,
  buttonText = "Continue",
  buttonTextSecondary,
  icon: Icon = Info,
  onConfirm,
  onClose,
  primaryButtonStyle,
  closeOnBackdrop = true,
  closeOnEscape = true,

  confirmDisabled = false,
  isLoading = false,

  children,
}: InfoModalProps) {

  const canClose = !isLoading;

  useEffect(() => {
    if (!visible) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && closeOnEscape && canClose) {
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleEscape);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible, closeOnEscape, canClose, onClose]);

  if (!visible) return null;

  return (
    <div
      className="info-modal-backdrop"
      role="presentation"
      onClick={() => {
        if (closeOnBackdrop && canClose) onClose?.();
      }}
    >
      <section
        className="info-modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="info-modal-icon-circle">
          <Icon size={32} />
        </div>

        <h2 id="info-modal-title" className="info-modal-title">
          {title}
        </h2>

        {message && <p className="info-modal-message">{message}</p>}

        {warning && <p className="info-modal-warning">{warning}</p>}

        {children && (
          <div className="info-modal-content">
            {children}
          </div>
        )}

        <div className="info-modal-button-row">
          {buttonTextSecondary && (
            <button
              type="button"
              className="info-modal-button info-modal-secondary-button"
              onClick={onClose}
              disabled={isLoading}
            >
              {buttonTextSecondary}
            </button>
          )}

          <button
            type="button"
            className="info-modal-button info-modal-primary-button"
            style={primaryButtonStyle}
            disabled={confirmDisabled || isLoading}
            onClick={onConfirm}
          >
            {buttonText}
          </button>
        </div>
      </section>
    </div>
  );
}
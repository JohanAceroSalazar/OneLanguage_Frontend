import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./AuthModal.css";

function AuthModal({ open, title, message, confirmText, onConfirm, tone = "success" }) {
    const { t } = useTranslation();
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onConfirm?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onConfirm]);

    if (!open) {
        return null;
    }

    return (
        <div className="auth-modal-overlay" onClick={() => onConfirm?.()}>
            <div
                className={`auth-modal-card auth-modal-${tone}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-modal-title"
                aria-describedby="auth-modal-message"
                onClick={(event) => event.stopPropagation()}
            >
                <p className="auth-modal-badge">{tone === "error" ? t("modal.review") : t("modal.ready")}</p>
                <h3 id="auth-modal-title" className="auth-modal-title">
                    {title}
                </h3>
                <p id="auth-modal-message" className="auth-modal-message">
                    {message}
                </p>
                <button type="button" className="auth-modal-button" onClick={() => onConfirm?.()}>
                    {confirmText || t("modal.understood")}
                </button>
            </div>
        </div>
    );
}

export default AuthModal;

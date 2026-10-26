import { useTranslation } from "react-i18next";
import "./PermissionDialog.css";

export default function PermissionDialog({ feature, onActivate, onClose }) {
    const { t } = useTranslation();
    if (!feature) return null;

    return <div className="permission-modal-overlay" role="presentation">
        <section className="permission-modal-box" role="dialog" aria-modal="true" aria-labelledby="permission-modal-title" aria-describedby="permission-modal-message">
            <h2 id="permission-modal-title" className="permission-modal-title">{t(`profile.${feature}PermissionTitle`)}</h2>
            <p id="permission-modal-message" className="permission-modal-text">{t(`profile.${feature}PermissionMessage`)}</p>
            <div className="permission-modal-actions">
                <button className="permission-modal-activate" type="button" onClick={onActivate}>{t("common.activate")}</button>
                <button className="permission-modal-cancel" type="button" onClick={onClose}>{t("cameraPermission.reject")}</button>
            </div>
        </section>
    </div>;
}

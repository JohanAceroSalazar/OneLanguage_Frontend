import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { FaCamera, FaMusic, FaFolder, FaUser } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import { clearAuthSession } from "../../services/authSession";
import { getCurrentUser } from "../../services/authService";
import i18n from "../../i18n";
import { readStoredAccessibility } from "../../services/accessibilityStorage";
import { getFeaturePermissions, setFeaturePermission } from "../../services/featurePermissionService";

function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [view, setView] = useState("profile"); // profile | password | camera | audio | files
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [user, setUser] = useState(null);
    const [profileError, setProfileError] = useState("");
    const [featurePermissions, setFeaturePermissions] = useState({ camera: false, audio: false, files: false });
    const [updatingPermission, setUpdatingPermission] = useState(null);
    const [permissionPrompt, setPermissionPrompt] = useState(null);

    useEffect(() => {
        let active = true;

        getCurrentUser()
            .then((currentUser) => {
                if (!active) return;
                setUser(currentUser);
                localStorage.setItem("user", JSON.stringify(currentUser));
            })
            .catch(() => {
                if (active) {
                    setUser(null);
                    setProfileError(t("profile.loadError", "No se pudo cargar el perfil."));
                }
            });

        getFeaturePermissions()
            .then((permissions) => {
                if (active) setFeaturePermissions(permissions);
            })
            .catch(() => {
                if (active) setProfileError(t("profile.loadError", "No se pudo cargar el perfil."));
            });

        return () => {
            active = false;
        };
    }, [t]);

    const handleLogout = () => {
        clearAuthSession();
        i18n.changeLanguage(readStoredAccessibility().language);
        navigate("/login", { replace: true });
    };

    const updateFeaturePermission = async (feature, enabled) => {
        if (updatingPermission) return;
        setUpdatingPermission(feature);
        try {
            if (enabled && feature === "camera") {
                const stream = await navigator.mediaDevices?.getUserMedia({ video: true, audio: false });
                if (!stream) throw new Error("camera_unavailable");
                stream.getTracks().forEach((track) => track.stop());
            }
            setFeaturePermissions(await setFeaturePermission(feature, enabled));
        } catch {
            setProfileError(t("profile.permissionDenied"));
        } finally {
            setUpdatingPermission(null);
        }
    };

    const handleFeaturePermission = (feature) => {
        if (updatingPermission) return;
        if (!featurePermissions[feature]) {
            setPermissionPrompt(feature);
            return;
        }
        void updateFeaturePermission(feature, false);
    };

    const confirmFeaturePermission = () => {
        if (!permissionPrompt) return;
        const feature = permissionPrompt;
        setPermissionPrompt(null);
        void updateFeaturePermission(feature, true);
    };

    const permissionPromptTitle = permissionPrompt ? t(`profile.${permissionPrompt}PermissionTitle`) : "";
    const permissionPromptMessage = permissionPrompt ? t(`profile.${permissionPrompt}PermissionMessage`) : "";

    // VISTA CÁMARA
    if (view === "camera") {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <BrandLogo className="profile-logo" />
                    <NavBar />
                </div>
                <div className="profile-center">
                    <div className="permission-card">
                        <FaCamera size={140} color="currentColor" />
                    </div>
                    <button className="yellow-btn" onClick={() => setView("profile")}>{t("profile.activateCamera")}</button>
                </div>
            </div>
        );
    }

    // VISTA AUDIO
    if (view === "audio") {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <BrandLogo className="profile-logo" />
                    <NavBar />
                </div>
                <div className="profile-center">
                    <div className="permission-card">
                        <FaMusic size={140} color="currentColor" />
                    </div>
                    <button className="yellow-btn" onClick={() => setView("profile")}>{t("profile.activateMic")}</button>
                </div>
            </div>
        );
    }

    // VISTA ARCHIVOS
    if (view === "files") {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <BrandLogo className="profile-logo" />
                    <NavBar />
                </div>
                <div className="profile-center">
                    <div className="permission-card">
                        <FaFolder size={140} color="currentColor" />
                    </div>
                    <button className="yellow-btn" onClick={() => setView("profile")}>{t("profile.grantFiles")}</button>
                </div>
            </div>
        );
    }

    // VISTA PRINCIPAL
    return (
        <div className="profile-container">
            <div className="profile-header">
                <BrandLogo className="profile-logo" />
                <NavBar />
            </div>

            <div className="profile-card">

                {profileError && <p role="alert">{profileError}</p>}

                {/* INFO PERSONAL */}
                <div className="profile-section">
                    <div className="profile-avatar-col">
                        <div className="profile-avatar">
                            <FaUser size={40} color="currentColor" />
                        </div>
                    </div>
                    <div className="profile-info-col">
                        <p className="section-title">{t("profile.personal")}</p>
                        <p className="section-subtitle">{t("profile.personalText")}</p>
                        <label className="field-label">{t("common.fullName")}</label>
                         <p className="profile-value">{user?.fullName || t("common.noAvailable")}</p>
                        <label className="field-label">{t("common.email")}</label>
                         <p className="profile-value">{user?.email || t("common.noAvailable")}</p>
                    </div>
                </div>

                <div className="profile-divider" />

                {/* PERMISOS */}
                <div className="permissions-section">
                    <p className="section-title">{t("profile.permissions")}</p>
                    <p className="section-subtitle">{t("profile.permissionsText")}</p>

                    <div className="permission-row">
                        <div className="permission-left">
                            <FaCamera size={20} />
                            <div>
                                <p className="perm-name">{t("common.camera")}</p>
                                <p className="perm-desc">{t("profile.cameraText")}</p>
                            </div>
                        </div>
                        <button className={`activate-btn ${featurePermissions.camera ? "is-active" : ""}`} onClick={() => handleFeaturePermission("camera")} disabled={updatingPermission !== null} aria-pressed={featurePermissions.camera}>
                            {updatingPermission === "camera" ? t("common.loading") : featurePermissions.camera ? t("common.deactivate") : t("common.activate")}
                        </button>
                    </div>

                    <div className="permission-row">
                        <div className="permission-left">
                            <FaMusic size={20} />
                            <div>
                                <p className="perm-name">{t("common.audio")}</p>
                                <p className="perm-desc">{t("profile.audioText")}</p>
                            </div>
                        </div>
                        <button className={`activate-btn ${featurePermissions.audio ? "is-active" : ""}`} onClick={() => handleFeaturePermission("audio")} disabled={updatingPermission !== null} aria-pressed={featurePermissions.audio}>
                            {updatingPermission === "audio" ? t("common.loading") : featurePermissions.audio ? t("common.deactivate") : t("common.activate")}
                        </button>
                    </div>

                    <div className="permission-row">
                        <div className="permission-left">
                            <FaFolder size={20} />
                            <div>
                                <p className="perm-name">{t("common.files")}</p>
                                <p className="perm-desc">{t("profile.filesText")}</p>
                            </div>
                        </div>
                        <button className={`activate-btn ${featurePermissions.files ? "is-active" : ""}`} onClick={() => handleFeaturePermission("files")} disabled={updatingPermission !== null} aria-pressed={featurePermissions.files}>
                            {updatingPermission === "files" ? t("common.loading") : featurePermissions.files ? t("common.deactivate") : t("common.activate")}
                        </button>
                    </div>
                </div>

                <div className="profile-divider" />

                {/* CERRAR SESIÓN */}
                <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                    {t("common.logout")}
                </button>
            </div>

            {/* MODAL CERRAR SESIÓN */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <p className="modal-text">{t("profile.logoutQuestion")}</p>
                        <div className="modal-actions">
                            <button className="modal-logout-btn" onClick={handleLogout}>{t("profile.confirmLogout")}</button>
                            <button className="modal-cancel-btn" onClick={() => setShowLogoutModal(false)}>{t("common.cancel")}</button>
                        </div>
                    </div>
                </div>
            )}

            {permissionPrompt && (
                <div className="modal-overlay" role="presentation">
                    <section className="modal-box permission-modal" role="dialog" aria-modal="true" aria-labelledby="permission-modal-title" aria-describedby="permission-modal-message">
                        <h2 id="permission-modal-title" className="permission-modal-title">{permissionPromptTitle}</h2>
                        <p id="permission-modal-message" className="modal-text">{permissionPromptMessage}</p>
                        <div className="modal-actions">
                            <button className="permission-modal-activate" type="button" onClick={confirmFeaturePermission}>{t("common.activate")}</button>
                            <button className="permission-modal-cancel" type="button" onClick={() => setPermissionPrompt(null)}>{t("cameraPermission.reject")}</button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default Profile;

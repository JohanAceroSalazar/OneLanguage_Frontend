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

function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [view, setView] = useState("profile"); // profile | password | camera | audio | files
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [user, setUser] = useState(null);
    const [profileError, setProfileError] = useState("");

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

        return () => {
            active = false;
        };
    }, [t]);

    const handleLogout = () => {
        clearAuthSession();
        i18n.changeLanguage(readStoredAccessibility().language);
        navigate("/login", { replace: true });
    };

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
                        <FaCamera size={140} color="#333" />
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
                        <FaMusic size={140} color="#333" />
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
                        <FaFolder size={140} color="#333" />
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
                            <FaUser size={40} color="#333" />
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
                        <button className="activate-btn" onClick={() => setView("camera")}>{t("common.activate")}</button>
                    </div>

                    <div className="permission-row">
                        <div className="permission-left">
                            <FaMusic size={20} />
                            <div>
                                <p className="perm-name">{t("common.audio")}</p>
                                <p className="perm-desc">{t("profile.audioText")}</p>
                            </div>
                        </div>
                        <button className="activate-btn" onClick={() => setView("audio")}>{t("common.activate")}</button>
                    </div>

                    <div className="permission-row">
                        <div className="permission-left">
                            <FaFolder size={20} />
                            <div>
                                <p className="perm-name">{t("common.files")}</p>
                                <p className="perm-desc">{t("profile.filesText")}</p>
                            </div>
                        </div>
                        <button className="activate-btn" onClick={() => setView("files")}>{t("common.activate")}</button>
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
        </div>
    );
}

export default Profile;

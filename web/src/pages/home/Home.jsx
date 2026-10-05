import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import "./Home.css";
import { useTranslation } from "react-i18next";

function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userName = "usuario";
    const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
    const [permissionError, setPermissionError] = useState("");
    const [requestingPermission, setRequestingPermission] = useState(false);

    const requestCameraPermission = async () => {
        setRequestingPermission(true);
        setPermissionError("");
        try {
            if (!navigator.mediaDevices?.getUserMedia) throw new Error("camera_unavailable");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            stream.getTracks().forEach((track) => track.stop());
            setPermissionDialogOpen(false);
            navigate("/translate");
        } catch {
            setPermissionError(t("cameraPermission.error"));
        } finally {
            setRequestingPermission(false);
        }
    };

    return (
        <div className="home-container">

            {/* HEADER */}
            <div className="home-header">
                <BrandLogo className="home-logo" />
                <NavBar />
            </div>

            {/* SALUDO */}
            <p className="home-greeting">{t("home.greeting", { name: userName })}</p>

            {/* TARJETA */}
            <div className="home-card">
                <h1>{t("home.title")}</h1>
                <p>{t("home.description")}</p>
                <button className="home-btn" onClick={() => setPermissionDialogOpen(true)}>
                    {t("home.start")}
                </button>
            </div>

            {permissionDialogOpen ? <div className="camera-permission-backdrop" role="presentation">
                <section className="camera-permission-dialog" role="dialog" aria-modal="true" aria-labelledby="camera-permission-title">
                    <h2 id="camera-permission-title">{t("cameraPermission.title")}</h2>
                    <p>{t("cameraPermission.message")}</p>
                    <p className="camera-permission-privacy">{t("cameraPermission.privacy")}</p>
                    {permissionError ? <p className="camera-permission-error" role="alert">{permissionError}</p> : null}
                    <div className="camera-permission-actions">
                        <button type="button" className="camera-permission-button" disabled={requestingPermission} onClick={requestCameraPermission}>
                            {requestingPermission ? t("cameraPermission.requesting") : t("common.ok")}
                        </button>
                        <button type="button" className="camera-permission-button" disabled={requestingPermission} onClick={() => setPermissionDialogOpen(false)}>
                            {t("cameraPermission.reject")}
                        </button>
                    </div>
                </section>
            </div> : null}

        </div>
    );
}

export default Home;

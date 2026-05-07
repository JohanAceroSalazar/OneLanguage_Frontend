import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Translate.css";
import { FaSyncAlt, FaCamera } from "react-icons/fa";

function Translate() {
    const [cameraActive, setCameraActive] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraActive(true);
        } catch (err) {
            alert("No se pudo acceder a la cámara");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
        setTranslatedText("");
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="translate-container">

            {/* HEADER */}
            <div className="translate-header">
                <div className="translate-logo">
                    <span>ONE<br/>LANGUAGE</span>
                </div>

                <button className="flip-btn" onClick={() => setFlipped(!flipped)}>
                    <FaSyncAlt />
                </button>

                <nav className="navbar">
                    <span className={location.pathname === "/home" ? "nav-item active" : "nav-item"} onClick={() => navigate("/home")}>Home</span>
                    <span className={location.pathname === "/translate" ? "nav-item active" : "nav-item"} onClick={() => navigate("/translate")}>Traducir</span>
                    <span className={location.pathname === "/historial" ? "nav-item active" : "nav-item"} onClick={() => navigate("/historial")}>Historial</span>
                    <span className={location.pathname === "/accesibilidad" ? "nav-item active" : "nav-item"} onClick={() => navigate("/accesibilidad")}>Accesibilidad</span>
                    <span className={location.pathname === "/perfil" ? "nav-item active" : "nav-item"} onClick={() => navigate("/perfil")}>Perfil</span>
                </nav>
            </div>

            {/* CONTENIDO */}
            <div className={`translate-content ${flipped ? "flipped" : ""}`}>

                <div className="translate-text-box">
                    <p>{translatedText || "El texto traducido aparecerá aquí..."}</p>
                </div>

                <div className="translate-camera-box" onClick={!cameraActive ? startCamera : undefined}>
                    {cameraActive ? (
                        <video ref={videoRef} autoPlay playsInline className="translate-video" />
                    ) : (
                        <div className="translate-camera-placeholder">
                            <FaCamera size={48} color="white" />
                            <p>Toca para activar la cámara</p>
                        </div>
                    )}
                </div>

            </div>

            {/* BOTÓN */}
            <button className="translate-btn" onClick={cameraActive ? stopCamera : startCamera}>
                {cameraActive ? "Finalizar traducción" : "Iniciar traducción"}
            </button>

        </div>
    );
}

export default Translate;
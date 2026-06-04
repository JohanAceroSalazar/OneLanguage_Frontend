import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Translate.css";
import { FaSyncAlt, FaCamera, FaVolumeUp, FaSave, FaRedo, FaPlay, FaPause } from "react-icons/fa";

function Translate() {
    const [cameraActive, setCameraActive] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const [view, setView] = useState("camera"); // "camera" | "result" | "audio"
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const audioRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setCameraActive(true);
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }, 100);
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
        setView("result");
    };

    const handleGenerateAudio = () => {
        // aquí conectas tu servicio de audio
        setView("audio");
    };

    const handleSave = () => {
        // aquí conectas tu servicio de guardado
        alert("Traducción guardada");
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleRepeat = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const NavBar = () => (
        <nav className="navbar">
            <span className={location.pathname === "/home" ? "nav-item active" : "nav-item"} onClick={() => navigate("/home")}>Home</span>
            <span className={location.pathname === "/translate" ? "nav-item active" : "nav-item"} onClick={() => navigate("/translate")}>Traducir</span>
            <span className={location.pathname === "/history" ? "nav-item active" : "nav-item"} onClick={() => navigate("/history")}>Historial</span>
            <span className={location.pathname === "/accessibility" ? "nav-item active" : "nav-item"} onClick={() => navigate("/accessibility")}>Accesibilidad</span>
            <span className={location.pathname === "/profile" ? "nav-item active" : "nav-item"} onClick={() => navigate("/profile")}>Perfil</span>
        </nav>
    );

    // VISTA AUDIO
    if (view === "audio") {
        return (
            <div className="translate-container">
                <div className="translate-header">
                    <div className="translate-logo">
                        <span>ONE<br/>LANGUAGE</span>
                    </div>
                    <NavBar />
                </div>

                <div className="translate-result">
                    <div className="translate-text-box result">
                        <p>{translatedText || "El texto traducido aparecerá aquí..."}</p>
                    </div>

                    {/* REPRODUCTOR */}
                    <div className="audio-player">
                        <button className="audio-play-btn" onClick={togglePlay}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        <div className="audio-bar">
                            <div className="audio-progress" />
                        </div>
                    </div>

                    <button className="translate-action-btn" onClick={handleRepeat}>
                        <FaRedo /> Repetir audio
                    </button>
                </div>
            </div>
        );
    }

    // VISTA RESULTADO
    if (view === "result") {
        return (
            <div className="translate-container">
                <div className="translate-header">
                    <div className="translate-logo">
                        <span>ONE<br/>LANGUAGE</span>
                    </div>
                    <NavBar />
                </div>

                <div className="translate-result">
                    <div className="translate-text-box result">
                        <p>{translatedText || "El texto traducido aparecerá aquí..."}</p>
                    </div>

                    <div className="translate-actions">
                        <button className="translate-action-btn" onClick={handleGenerateAudio}>
                            <FaVolumeUp /> Generar audio
                        </button>
                        <button className="translate-action-btn" onClick={handleSave}>
                            <FaSave /> Guardar traducción
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // VISTA CÁMARA (principal)
    return (
        <div className="translate-container">
            <div className="translate-header">
                <div className="translate-logo">
                    <span>ONE<br/>LANGUAGE</span>
                </div>
                <button className="flip-btn" onClick={() => setFlipped(!flipped)}>
                    <FaSyncAlt />
                </button>
                <NavBar />
            </div>

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

            <button className="translate-btn" onClick={cameraActive ? stopCamera : startCamera}>
                {cameraActive ? "Finalizar traducción" : "Iniciar traducción"}
            </button>
        </div>
    );
}

export default Translate;
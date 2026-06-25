import { useEffect, useRef, useState } from "react";
import { FaCamera, FaPause, FaPlay, FaRedo, FaSave, FaSyncAlt, FaVolumeUp } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import "./Translate.css";

function Translate() {
    const [cameraActive, setCameraActive] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [view, setView] = useState("camera"); // "camera" | "result" | "audio"
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const audioRef = useRef(null);

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
        } catch {
            alert("No se pudo acceder a la cámara");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
        setView("result");
    };

    const handleGenerateAudio = () => {
        setView("audio");
    };

    const handleSave = () => {
        alert("Traducción guardada");
    };

    const togglePlay = () => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setIsPlaying(!isPlaying);
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
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    if (view === "audio") {
        return (
            <div className="translate-container">
                <div className="translate-header">
                    <div className="translate-header-main">
                        <BrandLogo className="translate-logo" />
                    </div>
                    <NavBar />
                </div>

                <div className="translate-result">
                    <div className="translate-text-box result">
                        <p>El texto traducido aparecerá aquí...</p>
                    </div>

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

    if (view === "result") {
        return (
            <div className="translate-container">
                <div className="translate-header">
                    <div className="translate-header-main">
                        <BrandLogo className="translate-logo" />
                    </div>
                    <NavBar />
                </div>

                <div className="translate-result">
                    <div className="translate-text-box result">
                        <p>El texto traducido aparecerá aquí...</p>
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

    return (
        <div className="translate-container">
            <div className="translate-header">
                <div className="translate-header-main">
                    <BrandLogo className="translate-logo" />
                    <button className="flip-btn" onClick={() => setFlipped(!flipped)}>
                        <FaSyncAlt />
                    </button>
                </div>
                <NavBar />
            </div>

            <div className={`translate-content ${flipped ? "flipped" : ""}`}>
                <div className="translate-text-box">
                    <p>El texto traducido aparecerá aquí...</p>
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

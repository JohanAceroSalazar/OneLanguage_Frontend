import { useEffect, useRef, useState } from "react";
import { FaCamera, FaMicrophoneSlash, FaStop, FaSyncAlt, FaVolumeUp } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import "./Translate.css";

// Training videos are typically 25-30 FPS; this keeps the live temporal window comparable.
const FRAME_INTERVAL_MS = 40;
const FRAME_MAX_WIDTH = 640;

const statusMessages = {
    inactive: "Activa la camara para comenzar.",
    camera_connecting: "Preparando la camara...",
    camera_insecure: "La camara requiere abrir la aplicacion desde localhost o mediante HTTPS.",
    camera_denied: "El permiso de la camara fue denegado.",
    camera_unavailable: "No se encontro una camara disponible.",
    camera_busy: "La camara esta siendo usada por otra aplicacion.",
    camera_error: "No se pudo iniciar la camara.",
    connecting: "Conectando con el modelo de LSC...",
    ready: "Modelo conectado. Muestra una sena a la camara.",
    analyzing: "Analizando movimiento...",
    idle: "Esperando una sena...",
    waiting: "Esperando una sena clara...",
    no_hands: "Muestra las manos a la camara.",
    translated: "Sena reconocida",
    disconnected: "El servicio de IA no esta conectado.",
    service_error: "El servicio de IA no pudo procesar la imagen.",
};

function getAiSocketUrl() {
    if (import.meta.env.VITE_AI_WS_URL) {
        return import.meta.env.VITE_AI_WS_URL;
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${window.location.host}/ws/recognize`;
}

function Translate() {
    const [cameraActive, setCameraActive] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("inactive");
    const [translation, setTranslation] = useState("");
    const [confidence, setConfidence] = useState(0);
    const [modelVersion, setModelVersion] = useState("");
    const [autoSpeak, setAutoSpeak] = useState(true);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const socketRef = useRef(null);
    const captureTimerRef = useRef(null);
    const captureInFlightRef = useRef(false);
    const stoppingRef = useRef(false);
    const autoSpeakRef = useRef(autoSpeak);

    const stopCamera = () => {
        stoppingRef.current = true;
        captureInFlightRef.current = false;

        if (captureTimerRef.current) {
            window.clearInterval(captureTimerRef.current);
            captureTimerRef.current = null;
        }
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        window.speechSynthesis?.cancel();
        setCameraActive(false);
        setConnectionStatus("inactive");
    };

    const speak = (text) => {
        if (!text || !("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-CO";
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    };

    const captureFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const socket = socketRef.current;

        if (
            !video ||
            !canvas ||
            !socket ||
            socket.readyState !== WebSocket.OPEN ||
            video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
            captureInFlightRef.current ||
            socket.bufferedAmount > 0
        ) {
            return;
        }

        const width = Math.min(video.videoWidth || FRAME_MAX_WIDTH, FRAME_MAX_WIDTH);
        const height = Math.max(1, Math.round(width * (video.videoHeight / (video.videoWidth || width))));
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(video, 0, 0, width, height);

        canvas.toBlob(async (blob) => {
            if (!blob || socket.readyState !== WebSocket.OPEN || captureInFlightRef.current) {
                return;
            }
            captureInFlightRef.current = true;
            socket.send(await blob.arrayBuffer());
        }, "image/jpeg", 0.78);
    };

    const connectToModel = () => {
        setConnectionStatus("connecting");
        const socket = new WebSocket(getAiSocketUrl());
        socket.binaryType = "arraybuffer";
        socketRef.current = socket;

        socket.onopen = () => {
            if (socket !== socketRef.current) {
                return;
            }
        };

        socket.onmessage = (event) => {
            captureInFlightRef.current = false;
            const message = JSON.parse(event.data);

            if (message.type === "ready") {
                setModelVersion(message.model_version || "");
                setConnectionStatus("ready");
                if (!captureTimerRef.current) {
                    captureTimerRef.current = window.setInterval(captureFrame, FRAME_INTERVAL_MS);
                }
                return;
            }
            if (message.type === "error") {
                setConnectionStatus("service_error");
                return;
            }

            setConnectionStatus(message.status || "analyzing");
            setConfidence(message.confidence || 0);
            if (message.is_stable && message.text) {
                setTranslation(message.text);
            }
            if (message.is_new_translation && message.text && autoSpeakRef.current) {
                speak(message.text);
            }
        };

        socket.onerror = () => {
            captureInFlightRef.current = false;
            setConnectionStatus("disconnected");
        };

        socket.onclose = () => {
            captureInFlightRef.current = false;
            if (!stoppingRef.current) {
                setConnectionStatus("disconnected");
            }
        };
    };

    const startCamera = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setConnectionStatus("camera_unavailable");
            return;
        }

        const localHostnames = ["localhost", "127.0.0.1", "::1"];
        if (!window.isSecureContext && !localHostnames.includes(window.location.hostname)) {
            setConnectionStatus("camera_insecure");
            return;
        }

        stoppingRef.current = false;
        setConnectionStatus("camera_connecting");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCameraActive(true);
            connectToModel();
        } catch (error) {
            const cameraStatus = {
                NotAllowedError: "camera_denied",
                NotFoundError: "camera_unavailable",
                NotReadableError: "camera_busy",
            }[error?.name] || "camera_error";
            setConnectionStatus(cameraStatus);
        }
    };

    const toggleAutoSpeak = () => {
        const enabled = !autoSpeakRef.current;
        autoSpeakRef.current = enabled;
        setAutoSpeak(enabled);
        if (!enabled) {
            window.speechSynthesis?.cancel();
        }
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const liveMessage = statusMessages[connectionStatus] || statusMessages.camera_error;

    return (
        <div className="translate-container">
            <div className="translate-header">
                <div className="translate-header-main">
                    <BrandLogo className="translate-logo" />
                    <button className="translate-icon-btn" onClick={() => setFlipped(!flipped)} title="Cambiar disposicion" aria-label="Cambiar disposicion">
                        <FaSyncAlt />
                    </button>
                    <button
                        className={`translate-icon-btn ${autoSpeak ? "is-active" : ""}`}
                        onClick={toggleAutoSpeak}
                        title={autoSpeak ? "Desactivar voz" : "Activar voz"}
                        aria-label={autoSpeak ? "Desactivar voz" : "Activar voz"}
                    >
                        {autoSpeak ? <FaVolumeUp /> : <FaMicrophoneSlash />}
                    </button>
                </div>
                <NavBar />
            </div>

            <main className={`translate-content ${flipped ? "flipped" : ""}`}>
                <section className="translate-text-box" aria-live="polite">
                    <span className="translate-eyebrow">Traduccion en tiempo real</span>
                    <strong className={translation ? "translation-value" : "translation-placeholder"}>
                        {translation || "Aun no hay una sena reconocida"}
                    </strong>
                    <p className="translate-status">
                        {liveMessage}
                        {connectionStatus === "translated" && confidence > 0 ? ` ${Math.round(confidence * 100)}%` : ""}
                    </p>
                    {modelVersion && <span className="model-version">Modelo {modelVersion}</span>}
                </section>

                <section className="translate-camera-box" aria-label="Vista de camara para reconocimiento de senas">
                    <video ref={videoRef} autoPlay playsInline muted className={`translate-video ${cameraActive ? "is-visible" : ""}`} />
                    {!cameraActive && (
                        <div className="translate-camera-placeholder">
                            <FaCamera size={44} aria-hidden="true" />
                            <p>Activa la camara para interpretar senas</p>
                        </div>
                    )}
                    {cameraActive && <span className={`camera-status status-${connectionStatus}`}>{liveMessage}</span>}
                </section>
            </main>

            <canvas ref={canvasRef} className="frame-capture-canvas" aria-hidden="true" />
            <button className="translate-btn" onClick={cameraActive ? stopCamera : startCamera}>
                {cameraActive ? <><FaStop /> Finalizar traduccion</> : <><FaCamera /> Iniciar traduccion</>}
            </button>
        </div>
    );
}

export default Translate;

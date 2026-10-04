import { useCallback, useEffect, useRef, useState } from "react";
import { FaCamera, FaExchangeAlt, FaSave, FaStop, FaTrash, FaVolumeUp } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import { saveTranslation } from "../../services/translationService";
import "./Translate.css";
import { useTranslation } from "react-i18next";

const FRAME_INTERVAL_MS = 100;
const FRAME_TIMEOUT_MS = 10000;
const FRAME_MAX_WIDTH = 1280;
const JPEG_QUALITY = 0.68;
const CAMERA_CONSTRAINTS = {
    audio: false,
    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
};

function getAiSocketUrl() {
    const configuredUrl = import.meta.env.VITE_AI_WS_URL?.trim();
    if (configuredUrl) return configuredUrl;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${window.location.host}/ws/recognize`;
}

function getCameraErrorStatus(error) {
    if (error?.name === "NotAllowedError" || error?.name === "SecurityError") return "camera_denied";
    if (error?.name === "NotFoundError") return "camera_unavailable";
    if (error?.name === "NotReadableError") return "camera_busy";
    return "camera_error";
}

function Translate() {
    const { t } = useTranslation();
    const [cameraActive, setCameraActive] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [modelStatus, setModelStatus] = useState("inactive");
    const [translation, setTranslation] = useState("");
    const [sessionTranslations, setSessionTranslations] = useState([]);
    const [confidence, setConfidence] = useState(null);
    const [automaticSpeech, setAutomaticSpeech] = useState(true);
    const [reviewPending, setReviewPending] = useState(false);
    const [saving, setSaving] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const socketRef = useRef(null);
    const captureTimerRef = useRef(null);
    const framePendingRef = useRef(false);
    const encodingRef = useRef(false);
    const frameSentAtRef = useRef(0);
    const reconnectTimerRef = useRef(null);
    const connectModelRef = useRef(null);
    const sessionTranslationsRef = useRef([]);
    const confidenceRef = useRef(null);
    const speechSupported = "speechSynthesis" in window;

    const attachVideo = useCallback((node) => {
        videoRef.current = node;
        if (node && streamRef.current) {
            node.srcObject = streamRef.current;
            node.play().catch(() => undefined);
        }
    }, []);

    const stopCapture = useCallback(() => {
        if (captureTimerRef.current) {
            window.clearInterval(captureTimerRef.current);
            captureTimerRef.current = null;
        }
        framePendingRef.current = false;
        encodingRef.current = false;
    }, []);

    const stopCamera = useCallback((nextStatus = "inactive") => {
        stopCapture();
        if (reconnectTimerRef.current) {
            window.clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setCameraActive(false);
        setModelStatus(nextStatus);
    }, [stopCapture]);

    const speakTranslation = useCallback((text = translation) => {
        if (!speechSupported || !text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-CO";
        window.speechSynthesis.speak(utterance);
    }, [speechSupported, translation]);

    const clearLivePrediction = useCallback(() => {
        setTranslation("");
        setConfidence(null);
        confidenceRef.current = null;
    }, []);

    const handleModelMessage = useCallback((event) => {
        let message;
        try {
            message = JSON.parse(event.data);
        } catch {
            clearLivePrediction();
            setModelStatus("model_error");
            return;
        }
        if (message.type === "ready") {
            setModelStatus("ready");
            return;
        }
        if (message.type === "error") {
            framePendingRef.current = false;
            setModelStatus("processing_error");
            return;
        }
        if (message.type !== "prediction") return;

        framePendingRef.current = false;

        setModelStatus(message.status || "analyzing");
        if (message.status === "no_hands" || message.status === "idle") {
            clearLivePrediction();
            return;
        }

        const nextConfidence = typeof message.confidence === "number" ? message.confidence : null;
        setConfidence(nextConfidence);
        confidenceRef.current = nextConfidence;
        if (message.status !== "translated" || !message.text || !message.is_new_translation) return;

        const currentSession = sessionTranslationsRef.current;
        const nextSession = currentSession.at(-1) === message.text
            ? currentSession
            : [...currentSession, message.text];
        sessionTranslationsRef.current = nextSession;
        setSessionTranslations(nextSession);
        const assembledText = nextSession.join(" ");
        setTranslation(assembledText);
        if (automaticSpeech && speechSupported) speakTranslation(message.text);
    }, [automaticSpeech, clearLivePrediction, speakTranslation, speechSupported]);

    const startCapture = useCallback(() => {
        stopCapture();
        captureTimerRef.current = window.setInterval(() => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const socket = socketRef.current;
            if (!video || !canvas || !socket || socket.readyState !== WebSocket.OPEN || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
            if (!video.videoWidth || !video.videoHeight) return;
            if (framePendingRef.current) {
                if (Date.now() - frameSentAtRef.current > FRAME_TIMEOUT_MS) socket.close();
                return;
            }
            if (encodingRef.current) return;

            const width = Math.min(video.videoWidth, FRAME_MAX_WIDTH);
            const height = Math.round(width * video.videoHeight / video.videoWidth);
            if (canvas.width !== width) canvas.width = width;
            if (canvas.height !== height) canvas.height = height;
            const context = canvas.getContext("2d");
            if (!context) return;
            encodingRef.current = true;
            context.drawImage(video, 0, 0, width, height);
            canvas.toBlob((blob) => {
                encodingRef.current = false;
                if (blob && socketRef.current === socket && socket.readyState === WebSocket.OPEN && !framePendingRef.current) {
                    framePendingRef.current = true;
                    frameSentAtRef.current = Date.now();
                    try {
                        socket.send(blob);
                    } catch {
                        framePendingRef.current = false;
                        socket.close();
                    }
                }
            }, "image/jpeg", JPEG_QUALITY);
        }, FRAME_INTERVAL_MS);
    }, [stopCapture]);

    const connectModel = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN || socketRef.current?.readyState === WebSocket.CONNECTING) return;
        setModelStatus("connecting");
        const socket = new WebSocket(getAiSocketUrl());
        socketRef.current = socket;
        socket.addEventListener("message", handleModelMessage);
        socket.addEventListener("open", startCapture);
        socket.addEventListener("error", () => {
            clearLivePrediction();
            setModelStatus("model_error");
        });
        socket.addEventListener("close", () => {
            if (socketRef.current !== socket) return;
            socketRef.current = null;
            stopCapture();
            if (!streamRef.current || reconnectTimerRef.current) return;
            setModelStatus("connecting");
            reconnectTimerRef.current = window.setTimeout(() => {
                reconnectTimerRef.current = null;
                connectModelRef.current?.();
            }, 1000);
        });
    }, [clearLivePrediction, handleModelMessage, startCapture, stopCapture]);

    useEffect(() => {
        connectModelRef.current = connectModel;
    }, [connectModel]);

    const resetSession = useCallback(() => {
        sessionTranslationsRef.current = [];
        confidenceRef.current = null;
        setSessionTranslations([]);
        setTranslation("");
        setConfidence(null);
        setReviewPending(false);
    }, []);

    const startCamera = useCallback(async () => {
        if (reviewPending) return;
        if (!window.isSecureContext && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
            setModelStatus("camera_insecure");
            return;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
            setModelStatus("camera_unavailable");
            return;
        }

        resetSession();
        try {
            const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
            streamRef.current = stream;
            setCameraActive(true);
            setModelStatus("connecting");
            connectModel();
        } catch (error) {
            stopCamera(getCameraErrorStatus(error));
        }
    }, [connectModel, resetSession, reviewPending, stopCamera]);

    const finishTranslation = useCallback(() => {
        stopCamera();
        setReviewPending(sessionTranslationsRef.current.length > 0);
    }, [stopCamera]);

    const discardTranslation = useCallback(() => {
        resetSession();
        setModelStatus("inactive");
    }, [resetSession]);

    const saveCompletedTranslation = useCallback(async () => {
        const translatedText = sessionTranslationsRef.current.join(" ");
        if (!translatedText || saving) return;

        setSaving(true);
        try {
            await saveTranslation({ translatedText, confidence: confidenceRef.current });
            resetSession();
            setModelStatus("saved");
        } catch {
            setModelStatus("save_error");
        } finally {
            setSaving(false);
        }
    }, [resetSession, saving]);

    useEffect(() => () => {
        stopCamera();
        if (speechSupported) window.speechSynthesis.cancel();
    }, [speechSupported, stopCamera]);

    const sessionText = sessionTranslations.join(" ");
    const displayedTranslation = reviewPending ? sessionText : translation;
    const confidenceText = confidence === null ? null : t("translate.confidence", { value: Math.round(confidence * 100) });
    const statusText = t(`translate.status.${modelStatus}`, { defaultValue: t("translate.status.model_error") });

    return (
        <div className="translate-container">
            <header className="translate-header">
                <div className="translate-header-main">
                    <BrandLogo className="translate-logo" />
                    <button className="icon-button" type="button" onClick={() => setFlipped((value) => !value)} aria-label={t("translate.swap")} title={t("translate.swapTitle")}><FaExchangeAlt aria-hidden="true" /></button>
                    <button className={`speech-toggle ${automaticSpeech ? "is-active" : ""}`} type="button" onClick={() => setAutomaticSpeech((value) => !value)} aria-label={automaticSpeech ? t("translate.autoOff") : t("translate.autoOn")} disabled={!speechSupported}><FaVolumeUp aria-hidden="true" /><span>{automaticSpeech ? t("translate.voiceOn") : t("translate.voiceOff")}</span></button>
                </div>
                <NavBar />
            </header>

            <main className={`translate-content ${flipped ? "flipped" : ""}`}>
                <section className="translate-text-box" aria-live="polite">
                    <p className="translation-eyebrow">{t("translate.realtime")}</p>
                    <h1>{displayedTranslation || t("translate.empty")}</h1>
                    <p className="translation-status">{statusText}</p>
                    {confidenceText && <p className="translation-confidence">{confidenceText}</p>}
                    <button className="listen-translation" type="button" onClick={() => speakTranslation(displayedTranslation)} disabled={!displayedTranslation || !speechSupported}><FaVolumeUp aria-hidden="true" />{t("translate.listen")}</button>
                </section>
                <section className="translate-camera-box">
                    {cameraActive ? <video ref={attachVideo} autoPlay playsInline muted className="translate-video" /> : <div className="translate-camera-placeholder"><FaCamera size={48} aria-hidden="true" /><p>{t("translate.cameraHint")}</p></div>}
                </section>
            </main>

            {reviewPending ? (
                <div className="translation-review-actions">
                    <button className="review-save-btn" type="button" onClick={saveCompletedTranslation} disabled={saving}><FaSave aria-hidden="true" />{saving ? t("translate.saving") : t("translate.save")}</button>
                    <button className="review-discard-btn" type="button" onClick={discardTranslation} disabled={saving}><FaTrash aria-hidden="true" />{t("translate.discard")}</button>
                </div>
            ) : (
                <button className="translate-btn" type="button" onClick={cameraActive ? finishTranslation : startCamera}>
                    {cameraActive ? <FaStop aria-hidden="true" /> : <FaCamera aria-hidden="true" />}
                    {cameraActive ? t("translate.finish") : t("translate.start")}
                </button>
            )}
            <canvas ref={canvasRef} className="capture-canvas" aria-hidden="true" />
        </div>
    );
}

export default Translate;

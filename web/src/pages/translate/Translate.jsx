import { useCallback, useEffect, useRef, useState } from "react";
import { FaCamera, FaExchangeAlt, FaSave, FaStop, FaTrash, FaVolumeUp } from "react-icons/fa";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import NavBar from "../../components/NavBar/NavBar";
import { saveTranslation } from "../../services/translationService";
import "./Translate.css";
import { useTranslation } from "react-i18next";
import { getFeaturePermissions, setFeaturePermission } from "../../services/featurePermissionService";
import { getValidToken } from "../../services/authSession";
import PermissionDialog from "../../components/PermissionDialog";
import { resolveAiSocketUrl } from "../../config/aiSocketUrl";

const FRAME_INTERVAL_MS = 66;
const FRAME_TIMEOUT_MS = 10000;
const FRAME_MAX_WIDTH = 960;
const JPEG_QUALITY = 0.55;
const CAMERA_CONSTRAINTS = {
    audio: false,
    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
};

function getAiSocketUrl() {
    return resolveAiSocketUrl(import.meta.env.VITE_AI_WS_URL, window.location);
}

function getCameraErrorStatus(error) {
    if (error?.name === "NotAllowedError" || error?.name === "SecurityError") return "camera_denied";
    if (error?.name === "NotFoundError") return "camera_unavailable";
    if (error?.name === "NotReadableError") return "camera_busy";
    return "camera_error";
}

function Translate() {
    const { t } = useTranslation();
    const [permissionAlert, setPermissionAlert] = useState(null);
    const [permissionPrompt, setPermissionPrompt] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [modelStatus, setModelStatus] = useState("inactive");
    const [translation, setTranslation] = useState("");
    const [sessionTranslations, setSessionTranslations] = useState([]);
    const [confidence, setConfidence] = useState(null);
    const [automaticSpeech, setAutomaticSpeech] = useState(false);
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
    const recorderRef = useRef(null);
    const recorderChunksRef = useRef([]);
    const recordingBlobRef = useRef(null);
    const recordingStopResolverRef = useRef(null);
    const speechSupported = "speechSynthesis" in window;

    useEffect(() => {
        let active = true;
        const syncAudio = () => getFeaturePermissions().then((permissions) => {
            if (active) setAutomaticSpeech(permissions.audio && speechSupported);
        }).catch(() => { if (active) setAutomaticSpeech(false); });
        void syncAudio();
        window.addEventListener("focus", syncAudio);
        return () => { active = false; window.removeEventListener("focus", syncAudio); };
    }, [speechSupported]);

    const toggleAutomaticSpeech = async () => {
        if (automaticSpeech) {
            try {
                const permissions = await setFeaturePermission("audio", false);
                setAutomaticSpeech(permissions.audio);
                window.speechSynthesis.cancel();
            } catch { setPermissionAlert("audio"); }
        } else {
            setPermissionAlert("audio");
        }
    };

    const activatePermission = async () => {
        const feature = permissionPrompt;
        setPermissionPrompt(null);
        if (!feature) return;
        try {
            if (feature === "camera") {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                stream.getTracks().forEach((track) => track.stop());
            }
            const permissions = await setFeaturePermission(feature, true);
            if (feature === "audio") setAutomaticSpeech(permissions.audio && speechSupported);
        } catch {
            setModelStatus(feature === "camera" ? "camera_denied" : "inactive");
        }
    };

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

    const startRecording = useCallback((stream) => {
        recordingBlobRef.current = null;
        recorderChunksRef.current = [];
        if (typeof MediaRecorder === "undefined") return;

        const mimeType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
            .find((candidate) => MediaRecorder.isTypeSupported(candidate));
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        recorderRef.current = recorder;
        recorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) recorderChunksRef.current.push(event.data);
        });
        recorder.addEventListener("stop", () => {
            const chunks = recorderChunksRef.current;
            const recording = chunks.length ? new Blob(chunks, { type: recorder.mimeType || "video/webm" }) : null;
            recordingBlobRef.current = recording;
            recorderChunksRef.current = [];
            recorderRef.current = null;
            recordingStopResolverRef.current?.(recording);
            recordingStopResolverRef.current = null;
        });
        recorder.start(1000);
    }, []);

    const finishRecording = useCallback(() => {
        const recorder = recorderRef.current;
        if (!recorder || recorder.state === "inactive") return Promise.resolve(recordingBlobRef.current);
        return new Promise((resolve) => {
            recordingStopResolverRef.current = resolve;
            recorder.stop();
        });
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

        const nextSession = [...sessionTranslationsRef.current, message.text];
        sessionTranslationsRef.current = nextSession;
        setSessionTranslations(nextSession);
        setTranslation(message.text);
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
        const token = getValidToken();
        if (!token) {
            stopCamera("model_error");
            return;
        }
        setModelStatus("connecting");
        const socket = new WebSocket(getAiSocketUrl());
        socketRef.current = socket;
        socket.addEventListener("message", (event) => {
            try {
                if (JSON.parse(event.data).type === "ready") startCapture();
            } catch {
                // handleModelMessage reports malformed server messages.
            }
            handleModelMessage(event);
        });
        socket.addEventListener("open", () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "auth", token }));
            }
        });
        socket.addEventListener("error", () => {
            clearLivePrediction();
            void finishRecording();
            stopCamera("model_error");
        });
        socket.addEventListener("close", () => {
            if (socketRef.current !== socket) return;
            clearLivePrediction();
            void finishRecording();
            stopCamera("model_error");
        });
    }, [clearLivePrediction, finishRecording, handleModelMessage, startCapture, stopCamera]);

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
        try {
            const featurePermissions = await getFeaturePermissions();
            setAutomaticSpeech(featurePermissions.audio && speechSupported);
            if (!featurePermissions.camera) {
                setPermissionAlert("camera");
                return;
            }
            const browserPermission = await navigator.permissions?.query({ name: "camera" }).catch(() => null);
            if (browserPermission?.state === "denied") {
                setPermissionAlert("camera");
                return;
            }
        } catch {
            setPermissionAlert("camera");
            return;
        }
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
            stream.getVideoTracks().forEach((track) => {
                track.addEventListener("ended", () => {
                    stopCamera("camera_denied");
                    setPermissionAlert("camera");
                });
            });
            streamRef.current = stream;
            startRecording(stream);
            setCameraActive(true);
            setModelStatus("connecting");
            connectModel();
        } catch (error) {
            stopCamera(getCameraErrorStatus(error));
            if (getCameraErrorStatus(error) === "camera_denied") setPermissionAlert("camera");
        }
    }, [connectModel, resetSession, reviewPending, speechSupported, startRecording, stopCamera]);

    const finishTranslation = useCallback(async () => {
        const recording = finishRecording();
        stopCamera();
        await recording;
        setReviewPending(sessionTranslationsRef.current.length > 0);
    }, [finishRecording, stopCamera]);

    const discardTranslation = useCallback(() => {
        resetSession();
        setModelStatus("inactive");
    }, [resetSession]);

    const saveCompletedTranslation = useCallback(async () => {
        const translatedText = sessionTranslationsRef.current.join(" ");
        if (!translatedText || saving) return;

        setSaving(true);
        try {
            await saveTranslation({
                translatedText,
                confidence: confidenceRef.current,
                recording: recordingBlobRef.current,
            });
            resetSession();
            recordingBlobRef.current = null;
            setModelStatus("saved");
        } catch {
            setModelStatus("save_error");
        } finally {
            setSaving(false);
        }
    }, [resetSession, saving]);

    useEffect(() => () => {
        void finishRecording();
        stopCamera();
        if (speechSupported) window.speechSynthesis.cancel();
    }, [finishRecording, speechSupported, stopCamera]);

    const displayedTranslations = sessionTranslations.length
        ? sessionTranslations
        : translation
            ? [translation]
            : [];
    const resultText = displayedTranslations.join(" ");
    const resultFontSize = Math.max(16, 48 - Math.floor(resultText.length / 24) * 4);
    const confidenceText = confidence === null ? null : t("translate.confidence", { value: Math.round(confidence * 100) });
    const statusText = t(`translate.status.${modelStatus}`, { defaultValue: t("translate.status.model_error") });
    return (
        <div className="translate-container">
            <header className="translate-header">
                <div className="translate-header-main">
                    <BrandLogo className="translate-logo" />
                    <button className="icon-button" type="button" onClick={() => setFlipped((value) => !value)} aria-label={t("translate.swap")} title={t("translate.swapTitle")}><FaExchangeAlt aria-hidden="true" /></button>
                    <button className={`speech-toggle ${automaticSpeech ? "is-active" : ""}`} type="button" onClick={toggleAutomaticSpeech} aria-label={automaticSpeech ? t("translate.autoOff") : t("translate.autoOn")} disabled={!speechSupported}><FaVolumeUp aria-hidden="true" /><span>{automaticSpeech ? t("translate.voiceOn") : t("translate.voiceOff")}</span></button>
                </div>
                <NavBar />
            </header>

            <main className={`translate-content ${flipped ? "flipped" : ""}`}>
                <section className="translate-text-box" aria-live="polite">
                    <p className="translation-eyebrow">{t("translate.realtime")}</p>
                    <div className="translation-results">
                        {resultText ? <p style={{ fontSize: resultFontSize }} title={resultText}>{resultText}</p> : <h1>{t("translate.empty")}</h1>}
                    </div>
                    <p className="translation-status">{statusText}</p>
                    {confidenceText && <p className="translation-confidence">{confidenceText}</p>}
                </section>
                <section
                    className="translate-camera-box"
                >
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
            {permissionAlert ? <div className="camera-permission-backdrop" role="presentation">
                <section className="camera-permission-dialog" role="dialog" aria-modal="true" aria-labelledby="translate-permission-title">
                    <h2 id="translate-permission-title">{t(`profile.${permissionAlert}PermissionTitle`)}</h2>
                    <p>{t(`profile.${permissionAlert}PermissionMessage`)}</p>
                    <div className="camera-permission-actions">
                        <button type="button" className="camera-permission-button" onClick={() => { setPermissionPrompt(permissionAlert); setPermissionAlert(null); }}>{t("common.ok")}</button>
                        <button type="button" className="camera-permission-button" onClick={() => setPermissionAlert(null)}>{t("common.cancel")}</button>
                    </div>
                </section>
            </div> : null}
            <PermissionDialog feature={permissionPrompt} onActivate={() => void activatePermission()} onClose={() => setPermissionPrompt(null)} />
        </div>
    );
}

export default Translate;

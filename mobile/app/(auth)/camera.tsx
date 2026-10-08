import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Speech from "expo-speech";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomNav } from "../../components/bottom-nav";
import { BrandWordmark } from "../../components/brand-wordmark";
import { useMainPager } from "../../components/main-pager-context";
import { SwipeNavigation } from "../../components/swipe-navigation";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { AI_WEBSOCKET_URL } from "../../src/config/network";
import { saveTranslation } from "../../src/services/translationService";
import { getFeaturePermissions, setFeaturePermission } from "../../src/services/featurePermissionService";

// Expo Go obtains frames by taking pictures. A modest cadence prevents Android's
// shutter animation and gives MediaPipe a sharp, correctly oriented frame.
const FRAME_INTERVAL_MS = 50;
const FRAME_JPEG_QUALITY = 0.45;
const FRAME_TIMEOUT_MS = 10000;

type ModelStatus = "inactive" | "permission_required" | "connecting" | "ready" |
    "analyzing" | "waiting" | "translated" | "no_hands" | "idle" |
    "model_error" | "processing_error" | "camera_error" | "saved" | "save_error";

type PredictionMessage = {
    type: "ready" | "prediction" | "error";
    status?: ModelStatus;
    text?: string | null;
    confidence?: number;
    is_new_translation?: boolean;
};

const decodeBase64 = (value: string) => {
    const binary = globalThis.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes.buffer;
};

export default function Camera() {
    const { t } = useTranslation();
    const { colors, fontScale } = useTheme();
    const mainPager = useMainPager();
    const { height } = useWindowDimensions();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>("front");
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [pictureSize, setPictureSize] = useState<string>();
    const [automaticSpeech, setAutomaticSpeech] = useState(false);
    const [modelStatus, setModelStatus] = useState<ModelStatus>("inactive");
    const [translation, setTranslation] = useState("");
    const [sessionTranslations, setSessionTranslations] = useState<string[]>([]);
    const [confidence, setConfidence] = useState<number | null>(null);
    const [reviewPending, setReviewPending] = useState(false);
    const [saving, setSaving] = useState(false);

    const cameraRef = useRef<CameraView>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const captureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const activeRef = useRef(false);
    const readyRef = useRef(false);
    const captureBusyRef = useRef(false);
    const framePendingRef = useRef(false);
    const frameSentAtRef = useRef(0);
    const sessionRef = useRef<string[]>([]);
    const confidenceRef = useRef<number | null>(null);
    const speechRef = useRef(true);
    const connectRef = useRef<() => void>(() => undefined);

    const clearCapture = useCallback(() => {
        if (captureTimerRef.current) clearTimeout(captureTimerRef.current);
        captureTimerRef.current = null;
        captureBusyRef.current = false;
        framePendingRef.current = false;
    }, []);

    const clearLivePrediction = useCallback(() => {
        setTranslation("");
        setConfidence(null);
        confidenceRef.current = null;
    }, []);

    const startCapture = useCallback(() => {
        clearCapture();
        const capture = async () => {
            const socket = socketRef.current;
            if (!activeRef.current || !readyRef.current || !cameraRef.current ||
                !socket || socket.readyState !== WebSocket.OPEN) {
                if (activeRef.current) captureTimerRef.current = setTimeout(capture, FRAME_INTERVAL_MS);
                return;
            }
            if (captureBusyRef.current) return;
            if (framePendingRef.current) {
                if (Date.now() - frameSentAtRef.current > FRAME_TIMEOUT_MS) socket.close();
                if (activeRef.current) captureTimerRef.current = setTimeout(capture, FRAME_INTERVAL_MS);
                return;
            }
            captureBusyRef.current = true;
            try {
                const picture = await cameraRef.current.takePictureAsync({
                    base64: true,
                    quality: FRAME_JPEG_QUALITY,
                    // Keeping Expo's processing enabled preserves the camera
                    // orientation; disabling it can make hand landmarks fail.
                    skipProcessing: false,
                    shutterSound: false,
                });
                if (picture?.base64 && socket.readyState === WebSocket.OPEN) {
                    framePendingRef.current = true;
                    frameSentAtRef.current = Date.now();
                    socket.send(decodeBase64(picture.base64));
                }
            } catch {
                framePendingRef.current = false;
                if (activeRef.current) setModelStatus("camera_error");
            } finally {
                captureBusyRef.current = false;
                if (activeRef.current) captureTimerRef.current = setTimeout(capture, FRAME_INTERVAL_MS);
            }
        };
        captureTimerRef.current = setTimeout(capture, FRAME_INTERVAL_MS);
    }, [clearCapture]);

    const handleMessage = useCallback((event: WebSocketMessageEvent) => {
        let message: PredictionMessage;
        try {
            message = JSON.parse(String(event.data));
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

        const status = message.status || "analyzing";
        setModelStatus(status);
        if (status === "no_hands" || status === "idle") {
            clearLivePrediction();
            return;
        }
        const nextConfidence = typeof message.confidence === "number" ? message.confidence : null;
        setConfidence(nextConfidence);
        confidenceRef.current = nextConfidence;
        if (status !== "translated" || !message.text || !message.is_new_translation) return;

        const nextSession = [message.text];
        sessionRef.current = nextSession;
        setSessionTranslations(nextSession);
        setTranslation(message.text);
        if (speechRef.current) {
            Speech.stop();
            Speech.speak(message.text, { language: "es-CO" });
        }
    }, [clearLivePrediction]);

    const connectModel = useCallback(() => {
        const current = socketRef.current;
        if (current?.readyState === WebSocket.OPEN || current?.readyState === WebSocket.CONNECTING) return;
        setModelStatus("connecting");
        const socket = new WebSocket(AI_WEBSOCKET_URL);
        socketRef.current = socket;
        socket.onopen = startCapture;
        socket.onmessage = handleMessage;
        socket.onerror = () => {
            clearLivePrediction();
            setModelStatus("model_error");
        };
        socket.onclose = () => {
            if (socketRef.current !== socket) return;
            socketRef.current = null;
            clearCapture();
            if (!activeRef.current || reconnectTimerRef.current) return;
            setModelStatus("connecting");
            reconnectTimerRef.current = setTimeout(() => {
                reconnectTimerRef.current = null;
                connectRef.current();
            }, 1000);
        };
    }, [clearCapture, clearLivePrediction, handleMessage, startCapture]);

    useEffect(() => { connectRef.current = connectModel; }, [connectModel]);

    useEffect(() => {
        getFeaturePermissions().then((permissions) => {
            speechRef.current = permissions.audio;
            setAutomaticSpeech(permissions.audio);
        }).catch(() => undefined);
    }, []);

    const resetSession = useCallback(() => {
        sessionRef.current = [];
        confidenceRef.current = null;
        setSessionTranslations([]);
        setTranslation("");
        setConfidence(null);
        setReviewPending(false);
    }, []);

    const stopCamera = useCallback((status: ModelStatus = "inactive") => {
        activeRef.current = false;
        readyRef.current = false;
        clearCapture();
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
        const socket = socketRef.current;
        socketRef.current = null;
        socket?.close();
        setCameraReady(false);
        setCameraActive(false);
        setModelStatus(status);
    }, [clearCapture]);

    useEffect(() => {
        if (mainPager && mainPager.activeTab !== "camera" && cameraActive) {
            stopCamera();
        }
    }, [cameraActive, mainPager?.activeTab, stopCamera]);

    const startCamera = useCallback(async () => {
        const featurePermissions = await getFeaturePermissions();
        if (!featurePermissions.camera) {
            setModelStatus("permission_required");
            return;
        }
        speechRef.current = featurePermissions.audio;
        setAutomaticSpeech(featurePermissions.audio);
        let granted = permission?.granted;
        if (!granted) granted = (await requestPermission()).granted;
        if (!granted) {
            setModelStatus("permission_required");
            return;
        }
        resetSession();
        activeRef.current = true;
        setCameraActive(true);
        connectModel();
    }, [connectModel, permission?.granted, requestPermission, resetSession]);

    const toggleAutomaticSpeech = async () => {
        if (automaticSpeech) {
            speechRef.current = false;
            setAutomaticSpeech(false);
            Speech.stop();
            return;
        }

        if ((await getFeaturePermissions()).audio) {
            speechRef.current = true;
            setAutomaticSpeech(true);
            return;
        }

        Alert.alert(
            t("profile.audioPermissionTitle"),
            t("profile.audioPermissionMessage"),
            [
                { text: t("cameraPermission.reject"), style: "cancel" },
                {
                    text: t("common.activate"),
                    onPress: () => {
                        void setFeaturePermission("audio", true);
                        speechRef.current = true;
                        setAutomaticSpeech(true);
                    },
                },
            ],
        );
    };

    const finishTranslation = async () => {
        const hasTranslation = sessionRef.current.length > 0;
        stopCamera();
        setReviewPending(hasTranslation);
    };

    const saveCompletedTranslation = async () => {
        const translatedText = sessionRef.current.join(" ");
        if (!translatedText || saving) return;
        setSaving(true);
        try {
            await saveTranslation({
                translatedText,
                confidence: confidenceRef.current,
            });
            resetSession();
            setModelStatus("saved");
        } catch {
            setModelStatus("save_error");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => () => {
        stopCamera();
        Speech.stop();
    }, [stopCamera]);

    const displayedTranslation = reviewPending ? sessionTranslations.join(" ") : translation;
    const availableHeight = height - 112;
    const compactLayout = availableHeight < 780 || fontScale > 1;
    const cameraHeight = compactLayout
        ? Math.max(250, Math.min(340, availableHeight * 0.4))
        : Math.max(360, Math.min(620, availableHeight - 440));

    return (
        <SwipeNavigation active="camera">
        <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView
            contentContainerStyle={[styles.content, compactLayout && styles.compactContent]}
            showsVerticalScrollIndicator={false}
            scrollEnabled={compactLayout || availableHeight < 860 || reviewPending}
        >
        <View style={styles.header}>
        <BrandWordmark color={colors.text} style={styles.logo} />
        <View style={styles.headerActions}>
            <TouchableOpacity activeOpacity={0.8} style={[styles.iconButton, automaticSpeech && styles.iconButtonActive]} onPress={() => void toggleAutomaticSpeech()}>
                <Ionicons name={automaticSpeech ? "volume-high" : "volume-mute"} size={25} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} disabled={!cameraActive} style={[styles.iconButton, !cameraActive && styles.disabled]} onPress={() => {
                readyRef.current = false;
                setCameraReady(false);
                setPictureSize(undefined);
                setFacing((current) => current === "front" ? "back" : "front");
            }}>
                <Ionicons name="camera-reverse-outline" size={28} color={colors.accent} />
            </TouchableOpacity>
        </View>
    </View>

    <TouchableOpacity
        activeOpacity={0.88}
        disabled={cameraActive || reviewPending}
        onPress={startCamera}
        accessibilityRole={!cameraActive && !reviewPending ? "button" : undefined}
        accessibilityLabel={t("camera.start")}
        style={styles.cameraFrameTrigger}
    >
    <View style={[styles.cameraFrame, compactLayout && styles.compactCameraFrame, { borderColor: colors.border, height: cameraHeight }]}>
        {cameraActive ? <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} pictureSize={pictureSize} animateShutter={false} mute onCameraReady={async () => {
            if (!pictureSize) {
                try {
                    const sizes = await cameraRef.current?.getAvailablePictureSizesAsync();
                    const supported = sizes?.map((size) => {
                        const [width, height] = size.split("x").map(Number);
                        return { size, width, height };
                    }).filter(({ width, height }) =>
                        Math.min(width, height) >= 480 && Math.abs(Math.max(width, height) / Math.min(width, height) - 4 / 3) < 0.1
                    ).sort((a, b) => a.width * a.height - b.width * b.height);
                    if (supported?.length && activeRef.current) {
                        setPictureSize(supported[0].size);
                        return;
                    }
                } catch {
                    // Devices without a compatible camera size use the default resolution.
                }
            }
            readyRef.current = true;
            setCameraReady(true);
        }} onMountError={() => stopCamera("camera_error")} /> : <View style={styles.cameraPlaceholder}>
            <Ionicons name="camera-outline" size={52} color="#ffffff" />
            <Text style={styles.placeholderText}>{t("camera.activateHint")}</Text>
        </View>}
        {cameraActive && !cameraReady ? <View style={styles.cameraLoading}><ActivityIndicator color="#ffffff" size="large" /></View> : null}
    </View>
    </TouchableOpacity>

    <View style={[styles.resultCard, compactLayout && styles.compactResultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>{t("camera.realtime")}</Text>
        <Text style={[styles.resultText, { color: colors.textOnSurface, fontSize: 27 * fontScale }]}>{displayedTranslation || t("camera.empty")}</Text>
        <Text style={[styles.statusText, { color: colors.textOnSurface }]}>{t(`camera.status.${modelStatus}`)}</Text>
        {confidence !== null && displayedTranslation ? <Text style={[styles.confidenceText, { color: colors.textOnSurface }]}>{t("camera.confidence", { value: Math.round(confidence * 100) })}</Text> : null}
    </View>

    {reviewPending ? <View style={styles.reviewActions}>
        <TouchableOpacity activeOpacity={0.85} disabled={saving} onPress={saveCompletedTranslation} style={[styles.primaryButton, { backgroundColor: colors.accent }]}>
            {saving ? <ActivityIndicator color="#111827" /> : <Ionicons name="save-outline" size={21} color="#111827" />}
            <Text style={styles.primaryButtonText}>{saving ? t("camera.saving") : t("camera.save")}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} disabled={saving} onPress={() => { resetSession(); setModelStatus("inactive"); }} style={styles.discardButton}>
            <Ionicons name="trash-outline" size={21} color="#ffffff" />
            <Text style={styles.discardButtonText}>{t("camera.discard")}</Text>
        </TouchableOpacity>
    </View> : <TouchableOpacity activeOpacity={0.85} onPress={cameraActive ? finishTranslation : startCamera} style={[styles.primaryButton, { backgroundColor: colors.accent }]}>
        <Ionicons name={cameraActive ? "stop" : "camera"} size={21} color="#111827" />
        <Text style={styles.primaryButtonText}>{cameraActive ? t("camera.finish") : t("camera.start")}</Text>
    </TouchableOpacity>}
    </ScrollView>
    <BottomNav active="camera" />
    </SafeAreaView>
    </SwipeNavigation>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 96,
        alignItems: "center",
    },
    compactContent: {
        paddingTop: 20,
        paddingBottom: 92,
    },
    header: {
        width: "100%",
        paddingHorizontal: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    logo: { marginLeft: 8 },
    headerActions: { flexDirection: "row", gap: 8 },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255,255,255,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    iconButtonActive: { backgroundColor: "rgba(255,255,255,0.2)" },
    disabled: { opacity: 0.45 },
    cameraFrame: {
        // Phone cameras produce a portrait preview. Matching that geometry
        // removes the black side bars instead of stretching the image.
        width: "100%",
        alignSelf: "center",
        marginTop: 12,
        borderRadius: 8,
        borderWidth: 1,
        overflow: "hidden",
        backgroundColor: "#245f9f",
    },
    compactCameraFrame: { marginTop: 10 },
    cameraFrameTrigger: { width: "100%", alignItems: "center" },
    cameraPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    placeholderText: { color: "#ffffff", fontSize: 16, marginTop: 10, textAlign: "center" },
    cameraLoading: {
        ...StyleSheet.absoluteFill,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    resultCard: {
        width: "100%",
        minHeight: 190,
        marginTop: 12,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 18,
    },
    compactResultCard: {
        minHeight: 168,
        marginTop: 10,
        paddingVertical: 14,
    },
    eyebrow: { fontSize: 14, marginBottom: 10 },
    resultText: { lineHeight: 34, fontWeight: "500" },
    statusText: { fontSize: 15, marginTop: 12, opacity: 0.72 },
    confidenceText: { fontSize: 14, marginTop: 6, opacity: 0.72 },
    primaryButton: {
        width: "78%",
        minHeight: 52,
        marginTop: 14,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 9,
        paddingHorizontal: 18,
    },
    primaryButtonText: { color: "#111827", fontSize: 18, fontWeight: "700" },
    reviewActions: { width: "100%", alignItems: "center" },
    discardButton: {
        width: "78%",
        minHeight: 48,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: "#1f4f86",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 9,
    },
    discardButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
});

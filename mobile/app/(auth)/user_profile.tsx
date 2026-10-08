import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNav } from "../../components/bottom-nav";
import { BrandWordmark } from "../../components/brand-wordmark";
import { useMainPager } from "../../components/main-pager-context";
import { SwipeNavigation } from "../../components/swipe-navigation";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { clearAuthSession, getCurrentUser, getLocalAccessibilitySettings } from "../../src/services/authService";
import { setLanguage } from "../../src/i18n";
import {
    FeaturePermission,
    FeaturePermissions,
    getFeaturePermissions,
    setFeaturePermission,
} from "../../src/services/featurePermissionService";

type PermissionItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    active: boolean;
    loading: boolean;
    onPress: () => void;
};

function PermissionItem({ icon, title, description, active, loading, onPress }: PermissionItemProps) {
    const { colors, fontScale } = useTheme();
    const { t } = useTranslation();

    return (
    <View style={[styles.permissionItem, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}> 
        <Ionicons name={icon} size={34} color={colors.primary} />

    <View style={styles.permissionText}>
        <Text style={[styles.permissionTitle, { color: colors.textOnSurface, fontSize: 15 * fontScale }]}>{title}</Text>
        <Text style={[styles.permissionDescription, { color: colors.textMuted, fontSize: 12 * fontScale }]}>{description}</Text>
    </View>

    <TouchableOpacity
        activeOpacity={0.85}
        disabled={loading}
        onPress={onPress}
        accessibilityRole="switch"
        accessibilityState={{ checked: active, disabled: loading }}
        accessibilityLabel={`${title}: ${active ? t("common.activated") : t("common.activate")}`}
        style={[styles.activateButton, { backgroundColor: colors.accent }, active && styles.activatedButton, loading && styles.permissionButtonDisabled]}
    >
        <Text style={[styles.activateText, { color: colors.textOnSurface, fontSize: 13 * fontScale }]}>{loading ? "..." : active ? t("common.activated") : t("common.activate")}</Text>
    </TouchableOpacity>
    </View>
    );
}

export default function UserProfile() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors, fontScale, setThemeMode, setFontSizeMode, theme } = useTheme();
    const { t } = useTranslation();
    const mainPager = useMainPager();
    const [user, setUser] = useState<any>(null);
    const [featurePermissions, setFeaturePermissions] = useState<FeaturePermissions>({ camera: false, audio: false, files: false });
    const [updatingPermission, setUpdatingPermission] = useState<FeaturePermission | null>(null);
    const [permissionPrompt, setPermissionPrompt] = useState<FeaturePermission | null>(null);

    useEffect(() => {
    const loadUser = async () => {
        try {
            setUser(await getCurrentUser());
        } catch (error: any) {
            setUser(null);
            if (error?.status === 401) {
                router.replace("/(auth)/login");
            }
            console.error("Error al cargar los datos del usuario:", error);
        }
    };

    loadUser();
}, [router]);

    useEffect(() => {
        getFeaturePermissions().then(setFeaturePermissions).catch(() => undefined);
    }, []);

    useEffect(() => {
        if (mainPager?.activeTab === "profile") {
            getFeaturePermissions().then(setFeaturePermissions).catch(() => undefined);
        }
    }, [mainPager?.activeTab]);

    const enablePermission = async (feature: FeaturePermission) => {
        if (updatingPermission) return;
        setUpdatingPermission(feature);
        try {
            let granted = true;
            if (feature === "camera") {
                granted = (await Camera.requestCameraPermissionsAsync()).granted;
            }

            if (!granted) {
                Alert.alert(t("profile.permissions"), t("profile.permissionDenied"));
                return;
            }
            setFeaturePermissions(await setFeaturePermission(feature, true));
        } catch {
            Alert.alert(t("profile.permissions"), t("profile.permissionDenied"));
        } finally {
            setUpdatingPermission(null);
        }
    };

    const handlePermissionPress = (feature: FeaturePermission) => {
        if (updatingPermission) return;
        if (!featurePermissions[feature]) {
            setPermissionPrompt(feature);
            return;
        }
        void setFeaturePermission(feature, false).then(setFeaturePermissions);
        if (feature === "audio") Speech.stop();
    };

    const promptTitle = permissionPrompt ? t(`profile.${permissionPrompt}PermissionTitle`) : "";
    const promptMessage = permissionPrompt ? t(`profile.${permissionPrompt}PermissionMessage`) : "";

    const confirmPermission = () => {
        if (!permissionPrompt) return;
        const feature = permissionPrompt;
        setPermissionPrompt(null);
        void enablePermission(feature);
    };

    const handleLogout = async () => {
        await clearAuthSession();
        const anonymousSettings = await getLocalAccessibilitySettings();
        await setLanguage(anonymousSettings.language);
        setThemeMode(anonymousSettings.theme);
        setFontSizeMode(anonymousSettings.textSize);
        router.replace("/(auth)/login");
    };

    return (
    <SwipeNavigation active="profile">
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 105 + Math.max(insets.bottom, 8) }]}
        showsVerticalScrollIndicator={false}
    >
        <View style={styles.header}>
            <BrandWordmark color={colors.text} style={styles.logo} />
        <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.avatar}
            resizeMode="contain"
        />
        </View>

        <Text style={[styles.title, { color: colors.text, fontSize: 26 * fontScale }]}>{t("profile.title")}</Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={34} color={colors.primary} />

            <View>
                <Text style={[styles.sectionTitle, { color: colors.textOnSurface, fontSize: 18 * fontScale }]}>{t("profile.personal")}</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textMuted, fontSize: 13 * fontScale }]}> 
                {t("profile.personalText")}
            </Text>
            </View>
        </View>

        <Text style={[styles.label, { color: colors.textOnSurface, fontSize: 15 * fontScale }]}>{t("common.fullName")}</Text>
        <Text style={[styles.readonlyValue, { backgroundColor: colors.surfaceAlt, color: colors.textOnSurface, borderColor: colors.border }]}>
            {user?.fullName || t("common.noAvailable")}
        </Text>

        <Text style={[styles.label, { color: colors.textOnSurface, fontSize: 15 * fontScale }]}>{t("common.email")}</Text>
        <Text style={[styles.readonlyValue, { backgroundColor: colors.surfaceAlt, color: colors.textOnSurface, borderColor: colors.border }]}>
            {user?.email || t("common.noAvailable")}
        </Text>

        <Text style={[styles.permissionsTitle, { color: colors.textOnSurface, fontSize: 18 * fontScale }]}>{t("profile.permissions")}</Text>
        <Text style={[styles.permissionsSubtitle, { color: colors.textMuted, fontSize: 13 * fontScale }]}> 
            {t("profile.permissionsText")}
        </Text>

        <PermissionItem
            icon="camera-outline"
            title={t("common.camera")}
            description={t("profile.cameraText")}
            active={featurePermissions.camera}
            loading={updatingPermission === "camera"}
            onPress={() => handlePermissionPress("camera")}
        />
        <PermissionItem
            icon="musical-notes"
            title={t("common.audio")}
            description={t("profile.audioText")}
            active={featurePermissions.audio}
            loading={updatingPermission === "audio"}
            onPress={() => handlePermissionPress("audio")}
        />
        <PermissionItem
            icon="folder"
            title={t("common.files")}
            description={t("profile.filesText")}
            active={featurePermissions.files}
            loading={updatingPermission === "files"}
            onPress={() => handlePermissionPress("files")}
        />
        </View>

        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.logoutButton}
            onPress={handleLogout}
        >
          <Text
            style={[
              styles.logoutText,
              { color: theme === "dark" ? "#FFFFFF" : "#111827", fontSize: 20 * fontScale },
            ]}
          >
            {t("common.logout")}
          </Text>
        </TouchableOpacity>
    </ScrollView>

        <Modal visible={permissionPrompt !== null} transparent animationType="fade" onRequestClose={() => setPermissionPrompt(null)}>
            <View style={styles.permissionBackdrop}>
                <View style={[styles.permissionDialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.permissionDialogTitle, { color: colors.textOnSurface, fontSize: 27 * fontScale }]}>{promptTitle}</Text>
                    <Text style={[styles.permissionDialogText, { color: colors.textOnSurface, fontSize: 17 * fontScale }]}>{promptMessage}</Text>
                    <View style={styles.permissionDialogActions}>
                        <TouchableOpacity activeOpacity={0.85} onPress={confirmPermission} style={[styles.permissionDialogButton, { backgroundColor: colors.accent }]}>
                            <Text style={[styles.permissionDialogButtonText, { color: colors.textOnSurface, fontSize: 17 * fontScale }]}>{t("common.activate")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.85} onPress={() => setPermissionPrompt(null)} style={[styles.permissionDialogButton, { backgroundColor: colors.accent }]}>
                            <Text style={[styles.permissionDialogButtonText, { color: colors.textOnSurface, fontSize: 17 * fontScale }]}>{t("cameraPermission.reject")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        <BottomNav active="profile" />
    </SafeAreaView>
    </SwipeNavigation>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    },
content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 105,
    },
header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    },
logo: {
    marginLeft: 8,
    },
avatar: {
    width: 76,
    height: 58,
    },
title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 32,
    marginLeft: 8,
    },
card: {
    width: "100%",
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#6E6574",
    paddingHorizontal: 12,
    paddingTop: 15,
    paddingBottom: 18,
    },
sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 20,
    },
sectionTitle: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "500",
    },
sectionSubtitle: {
    color: "#333333",
    fontSize: 13,
    },
label: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
    marginBottom: 7,
    },
readonlyValue: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#9A9A9A",
    borderRadius: 11,
    paddingHorizontal: 10,
    color: "#777777",
    fontSize: 14,
    marginBottom: 13,
    backgroundColor: "#FFFFFF",
    textAlignVertical: "center",
    },
passwordButton: {
    alignSelf: "center",
    width: "78%",
    backgroundColor: "#FFEB3B",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 13,
    },
passwordButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "500",
    },
permissionsTitle: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "500",
    },
permissionsSubtitle: {
    color: "#555555",
    fontSize: 13,
    lineHeight: 14,
    marginBottom: 11,
    },
permissionItem: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    },
permissionText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
    },
permissionTitle: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "500",
    },
permissionDescription: {
    color: "#555555",
    fontSize: 12,
    lineHeight: 14,
    },
activateButton: {
    width: 78,
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: "#FFEB3B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#06142B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 3,
    },
activatedButton: {
    backgroundColor: "#D7C81B",
    },
permissionButtonDisabled: { opacity: 0.65 },
permissionBackdrop: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "rgba(11, 43, 80, 0.56)",
    },
permissionDialog: {
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    },
permissionDialogTitle: {
    fontWeight: "700",
    lineHeight: 33,
    textAlign: "center",
    },
permissionDialogText: {
    marginTop: 16,
    lineHeight: 24,
    textAlign: "center",
    },
permissionDialogActions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 28,
    },
permissionDialogButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#111827",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    },
permissionDialogButtonText: { fontWeight: "600", textAlign: "center" },
activateText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "500",
    },
logoutButton: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#D91414",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#06142B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    },
logoutText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    },
});

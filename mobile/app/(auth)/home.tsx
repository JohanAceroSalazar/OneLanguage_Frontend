import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { BottomNav } from "../../components/bottom-nav";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();
    const { colors, fontScale } = useTheme();
    const router = useRouter();
    const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
    const [permissionError, setPermissionError] = useState(false);
    const [requestingPermission, setRequestingPermission] = useState(false);

    const requestCameraPermission = async () => {
        setRequestingPermission(true);
        setPermissionError(false);
        try {
            const result = await Camera.requestCameraPermissionsAsync();
            if (!result.granted) {
                setPermissionError(true);
                return;
            }
            setPermissionDialogVisible(false);
            router.push("/(auth)/camera");
        } finally {
            setRequestingPermission(false);
        }
    };

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.logo, { color: colors.text, fontSize: 20 * fontScale }]}>ONE{"\n"}LANGUAGE</Text>

        <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text, fontSize: 24 * fontScale }]}>{t("home.greeting")}</Text>
        <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.avatar}
            resizeMode="contain"
            />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}> 
            <Text style={[styles.cardTitle, { color: colors.textOnSurface, fontSize: 30 * fontScale }]}>{t("home.title")}</Text>

        <Text style={[styles.description, { color: colors.textOnSurface, fontSize: 19 * fontScale }]}> 
            {t("home.description")}
        </Text>

        <TouchableOpacity activeOpacity={0.85} onPress={() => setPermissionDialogVisible(true)} style={[styles.button, { backgroundColor: colors.accent }]}>
            <Text style={[styles.buttonText, { color: colors.textOnSurface, fontSize: 25 * fontScale }]}>{t("home.start")}</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        <BottomNav active="home" />
        <Modal visible={permissionDialogVisible} transparent animationType="fade" onRequestClose={() => setPermissionDialogVisible(false)}>
            <View style={styles.permissionBackdrop}>
                <View style={[styles.permissionDialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.permissionTitle, { color: colors.textOnSurface, fontSize: 30 * fontScale }]}>{t("cameraPermission.title")}</Text>
                    <Text style={[styles.permissionText, { color: colors.textOnSurface, fontSize: 19 * fontScale }]}>{t("cameraPermission.message")}</Text>
                    <Text style={[styles.permissionText, styles.permissionPrivacy, { color: colors.textOnSurface, fontSize: 19 * fontScale }]}>{t("cameraPermission.privacy")}</Text>
                    {permissionError ? <Text style={styles.permissionError}>{t("cameraPermission.error")}</Text> : null}
                    <View style={styles.permissionActions}>
                        <TouchableOpacity disabled={requestingPermission} activeOpacity={0.85} onPress={requestCameraPermission} style={[styles.permissionButton, { backgroundColor: colors.accent }, requestingPermission && styles.permissionButtonDisabled]}>
                            <Text style={[styles.permissionButtonText, { color: colors.textOnSurface, fontSize: 19 * fontScale }]}>{requestingPermission ? t("cameraPermission.requesting") : t("common.ok")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={requestingPermission} activeOpacity={0.85} onPress={() => setPermissionDialogVisible(false)} style={[styles.permissionButton, { backgroundColor: colors.accent }, requestingPermission && styles.permissionButtonDisabled]}>
                            <Text style={[styles.permissionButtonText, { color: colors.textOnSurface, fontSize: 19 * fontScale }]}>{t("cameraPermission.reject")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    },
content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 118,
    },
logo: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#FFFFFF",
    marginLeft: 8,
    },
header: {
    width: "100%",
    marginTop: 36,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    },
greeting: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 27,
    fontWeight: "normal",
    },
avatar: {
    width: 76,
    height: 58,
    },
card: {
    width: "100%",
    marginTop: 60,
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#090909",
    minHeight: 475,
    justifyContent: "space-between",
    },
cardTitle: {
    color: "#000000",
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "600",
    textAlign: "center",
    },
description: {
    textAlign: "center",
    color: "#000000",
    fontSize: 19,
    lineHeight: 26,
    marginTop: 34,
    },
button: {
    alignSelf: "center",
    width: "92%",
    marginTop: 30,
    backgroundColor: "#FFEB3B",
    borderRadius: 14,
    paddingVertical: 3,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 6,
    },
buttonText: {
    color: "#000000",
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "600",
    textAlign: "center",
    },
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
permissionTitle: {
    fontWeight: "700",
    lineHeight: 36,
    textAlign: "center",
    },
permissionText: {
    marginTop: 20,
    lineHeight: 26,
    textAlign: "center",
    },
permissionPrivacy: { marginTop: 0 },
permissionError: {
    marginTop: 14,
    color: "#B42318",
    fontSize: 15,
    lineHeight: 20,
    textAlign: "center",
    },
permissionActions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 28,
    },
permissionButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    },
permissionButtonDisabled: { opacity: 0.65 },
permissionButtonText: { fontWeight: "600", textAlign: "center" },
});

import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { FeaturePermission } from "../src/services/featurePermissionService";
import { useTheme } from "../src/theme/ThemeContext";

type Props = {
  feature: FeaturePermission | null;
  notice?: boolean;
  onContinue?: () => void;
  onActivate: () => void;
  onClose: () => void;
};

export function FeaturePermissionDialog({ feature, notice = false, onContinue, onActivate, onClose }: Props) {
  const { colors, fontScale } = useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const stacked = width < 360 || fontScale > 1;

  return <Modal visible={feature !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
    <SafeAreaView edges={["top", "right", "bottom", "left"]} style={styles.safeArea}>
      <View style={styles.backdrop}>
        <View style={[styles.shell, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={[styles.title, { color: colors.textOnSurface, fontSize: 27 * fontScale }]}>{feature ? notice && feature === "camera" ? t("cameraPermission.title") : t(`profile.${feature}PermissionTitle`) : ""}</Text>
            <Text style={[styles.message, { color: colors.textOnSurface, fontSize: 17 * fontScale }]}>{feature ? notice && feature === "camera" ? t("cameraPermission.message") : t(`profile.${feature}PermissionMessage`) : ""}</Text>
            <View style={[styles.actions, stacked && styles.stacked]}>
              <TouchableOpacity activeOpacity={0.85} onPress={notice ? onContinue : onActivate} style={[styles.button, stacked && styles.stackedButton, { backgroundColor: colors.accent }]}>
                <Text style={[styles.buttonText, { color: colors.accentText, fontSize: 17 * fontScale }]}>{t(notice ? "common.ok" : "common.activate")}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.85} onPress={onClose} style={[styles.button, stacked && styles.stackedButton, { backgroundColor: colors.accent }]}>
                <Text style={[styles.buttonText, { color: colors.accentText, fontSize: 17 * fontScale }]}>{t(notice ? "common.cancel" : "cameraPermission.reject")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  </Modal>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  backdrop: { flex: 1, padding: 16, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(11, 43, 80, 0.56)" },
  shell: { width: "100%", maxWidth: 420, maxHeight: "92%", borderWidth: 2, borderRadius: 20, overflow: "hidden" },
  content: { paddingVertical: 24, paddingHorizontal: 20, flexGrow: 1 },
  title: { fontWeight: "700", lineHeight: 33, textAlign: "center" },
  message: { marginTop: 16, lineHeight: 24, textAlign: "center" },
  actions: { flexDirection: "row", gap: 14, marginTop: 28 },
  stacked: { flexDirection: "column", gap: 10 },
  button: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: "#111827", borderRadius: 10, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
  stackedButton: { width: "100%", flex: 0 },
  buttonText: { fontWeight: "600", textAlign: "center" },
});

import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 32) + 88 }]}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image source={require("../../assets/images/Logo.png")} style={styles.logoImage} />
          <Text style={[styles.brand, { color: colors.text }]}>One Language</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <Text style={[styles.badge, { color: colors.accent }]}>{t("landing.badge")}</Text>
        <Text style={[styles.valuePromise, { color: colors.accent }]}>{t("landing.value")}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{t("landing.title")}</Text>
        <Text style={[styles.description]}>{t("landing.description")}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.primaryButtonText}>{t("landing.create")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={() => router.push("/(auth)/login")}>
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>{t("landing.login")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}> 
        <View style={styles.infoItem}>
          <Ionicons name="flash-outline" size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>{t("landing.realtime")}</Text>
          <Text style={styles.infoText}>{t("landing.realtimeText")}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>{t("landing.history")}</Text>
          <Text style={styles.infoText}>{t("landing.historyText")}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="accessibility-outline" size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>{t("landing.accessible")}</Text>
          <Text style={styles.infoText}>{t("landing.accessibleText")}</Text>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logoImage: {
    width: 45,
    height: 45,
    marginTop: 0,
    borderRadius: 25,
  },
  brand: {
    fontSize: 25,
    fontWeight: "700",
    marginTop: 0,
  },
  heroCard: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 12,
  },
  badge: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 6,
    lineHeight: 38,
  },
  valuePromise: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color : "#fff",
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 0,
    shadowColor: "#06142B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#06142B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 3,
  },
  infoItem: {
    paddingVertical: 6,
    gap: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
  },
});

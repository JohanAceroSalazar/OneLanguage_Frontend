import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { forgotPassword } from "../../src/services/authService";
import { BrandWordmark } from "../../components/brand-wordmark";
import { useTheme } from "../../src/theme/ThemeContext";

const emailRegex = /\S+@\S+\.\S+/;

export default function RecoverPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, fontScale } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (value: string) => {
    setEmail(value);
    setError("");
    setSuccess("");
  };

  const handleSendLink = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(t("auth.emailRequired"));
      return;
    }

    if (!emailRegex.test(email)) {
      setError(t("auth.emailInvalid"));
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSuccess(t("auth.recoverSuccess"));
    } catch (err: any) {
      const message = String(err?.message || "");
      setError(
        /no existe un usuario|no account|not found/i.test(message)
          ? t("auth.recoverNotFound")
          : t("auth.recoverError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.keyboard, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <BrandWordmark color={colors.text} style={styles.logo} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text, fontSize: 31 * fontScale }]}>
            {t("auth.recoverTitle")}
          </Text>

          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.logoImg}
            resizeMode="contain"
          />

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("auth.recoverHint")}
          </Text>

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.textOnSurface }]}>{t("common.email")}</Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceAlt,
                  color: colors.textOnSurface,
                  borderColor: error ? "#ef4444" : colors.border,
                },
              ]}
              placeholder="andres@gmail.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={handleChange}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.button, { backgroundColor: colors.accent }]}
              onPress={handleSendLink}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.accentText} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.accentText, fontSize: 16 * fontScale }]}>
                  {t("auth.sendLink")}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={[styles.loginLink, { color: colors.text, fontSize: 15 * fontScale }]}>
              {t("auth.backLogin")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: 18,
  },
  title: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 10,
    fontWeight: "700",
    lineHeight: 36,
    maxWidth: 330,
  },
  subtitle: {
    maxWidth: 330,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.88,
    marginBottom: 24,
  },
  logoImg: {
    width: 190,
    height: 122,
    marginBottom: 10,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 2,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 8,
    marginTop: 6,
    fontWeight: "600",
  },
  successText: {
    color: "#15803d",
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    overflow: "hidden",
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 12,
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginTop: 18,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
    shadowColor: "#06142B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  loginLink: {
    fontSize: 15,
    marginTop: 22,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

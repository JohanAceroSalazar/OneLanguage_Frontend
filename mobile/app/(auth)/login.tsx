import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { AppAlert } from "../../components/app-alert";
import { BrandWordmark } from "../../components/brand-wordmark";
import { getAccessibilitySettings, hasLocalAccessibilitySettings, loginUser, persistLocalAccessibilitySettings } from "../../src/services/authService";
import i18n, { languageOptions } from "../../src/i18n";
import { useTheme } from "../../src/theme/ThemeContext";

const emailRegex = /\S+@\S+\.\S+/;

type AlertState = {
  visible: boolean;
  title: string;
  message: string;
  actionText: string;
  variant: "success" | "error";
  onAction: () => void;
};

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, theme, fontSizeMode, setThemeMode, setFontSizeMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    title: "",
    message: "",
    actionText: t("common.ok"),
    variant: "success",
    onAction: () => setAlert((current) => ({ ...current, visible: false })),
  });

  const closeAlert = () => setAlert((current) => ({ ...current, visible: false }));

  const validate = (nextForm = form) => ({
    email: !nextForm.email.trim()
      ? t("auth.emailRequired")
      : !emailRegex.test(nextForm.email)
        ? t("auth.emailInvalid")
        : "",
    password: !nextForm.password
      ? t("auth.passwordRequired")
      : nextForm.password.length < 6
        ? t("auth.passwordLength")
        : "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    setErrors(validate(nextForm));
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });

      if (response?.token) {
        await AsyncStorage.setItem("token", response.token);
      }

      if (response?.user) {
        await AsyncStorage.setItem("user", JSON.stringify(response.user));
      }

      try {
        const settings = await getAccessibilitySettings();
        await persistLocalAccessibilitySettings(settings);
        await i18n.changeLanguage(settings.language);
        setThemeMode(settings.theme);
        setFontSizeMode(settings.textSize);
      } catch {
        const accountHasSettings = await hasLocalAccessibilitySettings();
        const activeLanguage = languageOptions.some((option) => option.code === i18n.language)
          ? i18n.language as "es" | "en" | "pt" | "it"
          : "es";
        if (!accountHasSettings) {
        await persistLocalAccessibilitySettings({
          language: activeLanguage,
          theme,
          textSize: fontSizeMode,
        });
        }
      }

      setAlert({
        visible: true,
        title: t("auth.loginSuccess"),
        message: t("auth.loginSuccessMessage"),
        actionText: t("auth.enterNow"),
        variant: "success",
        onAction: () => {
          closeAlert();
          router.replace("/(auth)/main");
        },
      });
    } catch (error: any) {
      setAlert({
        visible: true,
        title: t("auth.loginError"),
        message: error?.message || t("auth.credentialsError"),
        actionText: t("common.ok"),
        variant: "error",
        onAction: closeAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
      <View style={styles.topBar}>
        <BrandWordmark color={colors.text} style={styles.logo} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{t("auth.login")}</Text>

      <Image source={require("../../assets/images/Logo.png")} style={styles.logoImg} resizeMode="contain" />

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textOnSurface }]}>{t("common.email")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textOnSurface, borderColor: errors.email ? "#ef4444" : colors.border }]}
          placeholder="andres@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.textMuted}
          value={form.email}
          onChangeText={(val) => handleChange("email", val)}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={[styles.label, { color: colors.textOnSurface }]}>{t("common.password")}</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={[styles.inputPassword, { backgroundColor: colors.surfaceAlt, color: colors.textOnSurface, borderColor: errors.password ? "#ef4444" : colors.border }]}
            placeholder="********"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(val) => handleChange("password", val)}
          />
          <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.accentText} /> : <Text style={[styles.buttonText, { color: colors.accentText }]}>{t("auth.login")}</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/(auth)/recover_password")}>
        <Text style={styles.link}>{t("auth.forgot")}</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        {t("auth.noAccount")} <Text style={styles.registerLink} onPress={() => router.push("/(auth)/register")}>{t("auth.register")}</Text>
      </Text>

        </ScrollView>
      </KeyboardAvoidingView>
      <AppAlert
        visible={alert.visible}
        label={t("common.ok")}
        title={alert.title}
        message={alert.message}
        actionText={alert.actionText}
        variant={alert.variant}
        onAction={alert.onAction}
      />
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
    justifyContent: "flex-start",
    paddingTop: 24,
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
  title: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 60,
    marginBottom: 8,
    fontWeight: "700",
  },
  logoImg: {
    width: 220,
    height: 140,
    marginBottom: 16,
  },
  card: {
    color: "#ffffff",
    width: "100%",
    maxWidth: 380,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    elevation: 4,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 2,
  },
  inputPassword: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingRight: 44,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 14,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 8,
    marginTop: 4,
    fontWeight: "600",
  },
  passwordField: {
    position: "relative",
    justifyContent: "center",
    marginBottom: 2,
  },
  icon: {
    position: "absolute",
    right: 12,
  },
  button: {
    width: "100%",
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#06142B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  link: {
    fontSize: 15,
    marginTop: 18,
    color: "#ffffff",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  registerText: {
    color: "#ffffff",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  registerLink: {
    fontWeight: "700",
    color: "#ffffff",
    textDecorationLine: "underline",
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppAlert } from "../../components/app-alert";
import { getAccessibilitySettings, loginUser } from "../../src/services/authService";
import { setLanguage } from "../../src/i18n";
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
  const { colors, setThemeMode, setFontSizeMode } = useTheme();
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
        await setLanguage(settings.language);
        setThemeMode(settings.theme);
        setFontSizeMode(settings.textSize);
      } catch {
        // El inicio de sesión no depende de que el backend de preferencias esté disponible.
      }

      setAlert({
        visible: true,
        title: t("auth.loginSuccess"),
        message: t("auth.loginSuccessMessage"),
        actionText: t("auth.enterNow"),
        variant: "success",
        onAction: () => {
          closeAlert();
          router.replace("/(auth)/home");
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.logo, { color: colors.text }]}>ONE{"\n"}LANGUAGE</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{t("auth.login")}</Text>

      <Image source={require("../../assets/images/Logo.png")} style={styles.logoImg} resizeMode="contain" />

      <View style={[styles.card, { backgroundColor: "#ffffff", borderColor: colors.border }]}>
        <Text style={styles.label}>{t("common.email")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.email ? "#ef4444" : "#d1d5db" }]}
          placeholder="andres@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#6b7280"
          value={form.email}
          onChangeText={(val) => handleChange("email", val)}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.label}>{t("common.password")}</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={[styles.inputPassword, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.password ? "#ef4444" : "#d1d5db" }]}
            placeholder="********"
            placeholderTextColor="#6b7280"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(val) => handleChange("password", val)}
          />
          <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>{t("auth.login")}</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/(auth)/recover_password")}>
        <Text style={styles.link}>{t("auth.forgot")}</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        {t("auth.noAccount")} <Text style={styles.registerLink} onPress={() => router.push("/(auth)/register")}>{t("auth.register")}</Text>
      </Text>

      <AppAlert
        visible={alert.visible}
        label={t("common.ok")}
        title={alert.title}
        message={alert.message}
        actionText={alert.actionText}
        variant={alert.variant}
        onAction={alert.onAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 56,
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
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 22,
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

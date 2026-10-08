import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppAlert } from "../../components/app-alert";
import { BrandWordmark } from "../../components/brand-wordmark";
import { registerUser } from "../../src/services/authService";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

type AlertState = {
  visible: boolean;
  title: string;
  message: string;
  actionText: string;
  variant: "success" | "error";
  onAction: () => void;
};

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", acceptedTerms: false });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", acceptedTerms: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    title: "",
    message: "",
    actionText: "Aceptar",
    variant: "success",
    onAction: () => setAlert((current) => ({ ...current, visible: false })),
  });

  const closeAlert = () => setAlert((current) => ({ ...current, visible: false }));

  const passwordStrength = useMemo(() => {
    if (!form.password) return "";
    if (form.password.length < 8) return t("auth.weak");
    return passwordRegex.test(form.password) ? t("auth.strong") : t("auth.medium");
  }, [form.password, t]);

  const validate = (nextForm = form) => ({
    name: !nextForm.name.trim() ? t("auth.nameRequired") : nextForm.name.trim().length < 3 ? t("auth.minChars") : "",
    email: !nextForm.email.trim() ? t("auth.emailRequired") : !emailRegex.test(nextForm.email) ? t("auth.emailInvalid") : "",
    password: !nextForm.password ? t("auth.passwordRequired") : !passwordRegex.test(nextForm.password) ? t("auth.passwordRules") : "",
    confirmPassword: !nextForm.confirmPassword ? t("auth.confirmRequired") : nextForm.confirmPassword !== nextForm.password ? t("auth.passwordMismatch") : "",
    acceptedTerms: nextForm.acceptedTerms ? "" : t("auth.acceptTerms"),
  });

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    setErrors(validate(nextForm));
  };

  const handleRegister = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      setAlert({
        visible: true,
        title: t("auth.registerSuccess"),
        message: t("auth.registerSuccessMessage"),
        actionText: t("auth.goLogin"),
        variant: "success",
        onAction: () => {
          closeAlert();
          router.replace("/(auth)/login");
        },
      });
    } catch (error: any) {
      setAlert({
        visible: true,
        title: t("auth.registerError"),
        message: error?.message || t("auth.registerError"),
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
        <BrandWordmark color={colors.text} style={styles.logo} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{t("auth.register")}</Text>

      <View style={[styles.card, { backgroundColor: "#ffffff", borderColor: colors.border }]}>
        <Text style={styles.label}>{t("common.fullName")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.name ? "#ef4444" : "#d1d5db" }]}
          placeholder={t("common.fullName")}
          placeholderTextColor="#6b7280"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <Text style={styles.label}>{t("common.email")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.email ? "#ef4444" : "#d1d5db" }]}
          placeholder="andres@gmail.com"
          placeholderTextColor="#6b7280"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.label}>{t("common.password")}</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={[styles.inputPassword, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.password ? "#ef4444" : "#d1d5db" }]}
          placeholder={t("auth.passwordMin")}
            placeholderTextColor="#6b7280"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        {passwordStrength ? <Text style={styles.hint}>{t("misc.passwordStrength")}: {passwordStrength}</Text> : null}

        <Text style={styles.label}>{t("common.confirmPassword")}</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={[styles.inputPassword, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.confirmPassword ? "#ef4444" : "#d1d5db" }]}
          placeholder={t("auth.repeat")}
            placeholderTextColor="#6b7280"
            secureTextEntry={!showConfirmPassword}
            value={form.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
          />
          <TouchableOpacity style={styles.icon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => handleChange("acceptedTerms", !form.acceptedTerms)} accessibilityRole="checkbox" accessibilityState={{ checked: form.acceptedTerms }}>
            <Ionicons name={form.acceptedTerms ? "checkbox" : "square-outline"} size={20} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.termsLabel}>
            <Text style={styles.termsPrefix}>{t("auth.acceptPrefix")}</Text>
            <TouchableOpacity onPress={() => setShowTerms(true)} accessibilityRole="button" accessibilityState={{ expanded: showTerms }}>
              <Text style={styles.termsLink}>{t("terms.title")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {errors.acceptedTerms ? (
          <View style={styles.termsAlert} accessibilityRole="alert">
            <Ionicons name="alert-circle-outline" size={18} color="#111827" />
            <Text style={styles.termsAlertText}>{errors.acceptedTerms}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>{t("auth.create")}</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.loginText}>
        {t("auth.hasAccount")} <Text style={styles.loginLink} onPress={() => router.push("/(auth)/login")}>{t("auth.login")}</Text>
      </Text>

      <Modal visible={showTerms} transparent animationType="fade" onRequestClose={() => setShowTerms(false)}>
        <View style={styles.termsModalBackdrop}>
          <View style={styles.termsModalDialog} accessibilityRole="alert">
            <View style={styles.termsContentHeader}>
              <Text style={styles.termsContentTitle}>{t("terms.title")}</Text>
              <TouchableOpacity style={styles.termsModalClose} onPress={() => setShowTerms(false)} accessibilityLabel={t("common.back")}>
                <Ionicons name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.termsContentBody} nestedScrollEnabled showsVerticalScrollIndicator>
              <Text style={styles.termsContentText}>{t("terms.app")}</Text>
              <Text style={styles.termsContentText}>{t("terms.updated")}</Text>
              <Text style={styles.termsContentText}>{t("terms.welcome")}</Text>
              {[1, 2, 3, 4, 5, 6, 7].map((section) => (
                <View key={section} style={styles.termsSection}>
                  <Text style={styles.termsContentSubtitle}>{t(`terms.s${section}`)}</Text>
                  <Text style={styles.termsContentText}>{t(`terms.p${section}`)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <AppAlert
        visible={alert.visible}
        label={alert.variant === "success" ? "LISTO" : "AVISO"}
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
    paddingTop: 72,
    paddingHorizontal: 20,
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 30,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    marginTop: 6,
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
  passwordField: {
    position: "relative",
    justifyContent: "center",
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
  hint: {
    fontSize: 12,
    marginBottom: 4,
    marginTop: 2,
    color: "#6b7280",
    fontWeight: "600",
  },
  icon: {
    position: "absolute",
    right: 12,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  termsLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  termsPrefix: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
  },
  termsLink: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  termsModalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(6,20,43,0.58)",
  },
  termsModalDialog: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "82%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
  },
  termsContentHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  termsContentTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },
  termsContentBody: {
    maxHeight: 480,
    marginTop: 8,
  },
  termsContentText: {
    color: "#111827",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  termsContentSubtitle: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },
  termsSection: {
    marginTop: 4,
  },
  termsModalClose: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 6,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  termsAlert: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#111827",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  termsAlertText: {
    color: "#111827",
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
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
  loginText: {
    color: "#ffffff",
    marginTop: 14,
    fontSize: 14,
    textAlign: "center",
  },
  loginLink: {
    fontWeight: "700",
    color: "#ffffff",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 6,
    marginTop: 4,
    fontWeight: "600",
  },
});



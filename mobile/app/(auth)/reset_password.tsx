import { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { resetPassword } from "../../src/services/authService";
import { useTheme } from "../../src/theme/ThemeContext";

const getParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; token?: string }>();
  const { colors, fontScale } = useTheme();
  const tokenIdentifier = getParam(params.id);
  const token = getParam(params.token);

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordValid =
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[a-z]/.test(form.password) &&
    /\d/.test(form.password);

  const confirmTouched = form.confirmPassword.length > 0;
  const passwordsMatch = form.password === form.confirmPassword;
  const confirmError = confirmTouched && !passwordsMatch;
  const confirmSuccess = confirmTouched && passwordsMatch && passwordValid;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!tokenIdentifier || !token) {
      setError("El enlace de recuperacion no es valido o esta incompleto.");
      return;
    }

    if (!passwordValid) {
      setError("La contrasena debe tener minimo 8 caracteres, una mayuscula, una minuscula y un numero.");
      return;
    }

    if (!form.confirmPassword) {
      setError("Debes confirmar tu nueva contrasena.");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(tokenIdentifier, token, form.password, form.confirmPassword);
      setSuccess("Contrasena restablecida correctamente. Te llevaremos al inicio de sesion.");

      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "No se pudo restablecer la contrasena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.keyboard, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={[styles.logo, { color: colors.text }]}>ONE{"\n"}LANGUAGE</Text>
        </View>

        <Text style={[styles.title, { color: colors.text, fontSize: 32 * fontScale }]}>
          Restablecer{"\n"}contrasena
        </Text>

        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logoImg}
          resizeMode="contain"
        />

        <View style={[styles.card, { backgroundColor: "#ffffff", borderColor: colors.border }]}>
          <Text style={styles.label}>Nueva contrasena</Text>
          <View style={styles.passwordField}>
            <TextInput
              style={[
                styles.inputPassword,
                {
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  borderColor: form.password && !passwordValid ? "#ef4444" : "#d1d5db",
                },
              ]}
              placeholder="Minimo 8 caracteres"
              placeholderTextColor="#6b7280"
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.icon} onPress={() => setShowPassword((current) => !current)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.hint, passwordValid && styles.successInline]}>
            Minimo 8 caracteres, una mayuscula, una minuscula y un numero.
          </Text>

          <Text style={styles.label}>Confirmar contrasena</Text>
          <View style={styles.passwordField}>
            <TextInput
              style={[
                styles.inputPassword,
                {
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  borderColor: confirmError ? "#ef4444" : "#d1d5db",
                },
              ]}
              placeholder="Confirma tu contrasena"
              placeholderTextColor="#6b7280"
              secureTextEntry={!showConfirmPassword}
              value={form.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.icon} onPress={() => setShowConfirmPassword((current) => !current)}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {confirmError ? <Text style={styles.errorText}>Las contrasenas no coinciden.</Text> : null}
          {confirmSuccess ? <Text style={styles.successInline}>Las contrasenas coinciden.</Text> : null}

          {error ? <Text style={styles.errorBox}>{error}</Text> : null}
          {success ? <Text style={styles.successBox}>{success}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={handleReset}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={[styles.buttonText, { fontSize: 16 * fontScale }]}>
                Restablecer contrasena
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={[styles.loginLink, { color: colors.text, fontSize: 15 * fontScale }]}>
            Volver al inicio de sesion
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 56,
    paddingBottom: 30,
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
    textAlign: "center",
    marginTop: 40,
    marginBottom: 8,
    fontWeight: "700",
    lineHeight: 38,
  },
  logoImg: {
    width: 200,
    height: 126,
    marginBottom: 14,
  },
  card: {
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
    color: "#111827",
    marginBottom: 6,
    marginTop: 6,
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
  icon: {
    position: "absolute",
    right: 12,
  },
  hint: {
    color: "#6b7280",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 8,
    fontWeight: "500",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 6,
    marginTop: 4,
    fontWeight: "600",
  },
  successInline: {
    color: "#15803d",
    fontSize: 12,
    marginBottom: 6,
    marginTop: 4,
    fontWeight: "700",
  },
  errorBox: {
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  successBox: {
    color: "#15803d",
    backgroundColor: "#dcfce7",
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginTop: 16,
    borderWidth: 2,
    borderColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  loginLink: {
    fontSize: 15,
    marginTop: 20,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
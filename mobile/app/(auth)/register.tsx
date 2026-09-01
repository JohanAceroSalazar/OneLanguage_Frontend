import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppAlert } from "../../components/app-alert";
import { registerUser } from "../../src/services/authService";
import { useTheme } from "../../src/theme/ThemeContext";

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
  const router = useRouter();
  const { colors } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", acceptedTerms: false });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", acceptedTerms: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (form.password.length < 8) return "Débil";
    return passwordRegex.test(form.password) ? "Fuerte" : "Media";
  }, [form.password]);

  const validate = (nextForm = form) => ({
    name: !nextForm.name.trim() ? "El nombre es obligatorio" : nextForm.name.trim().length < 3 ? "Ingresa al menos 3 caracteres" : "",
    email: !nextForm.email.trim() ? "El correo es obligatorio" : !emailRegex.test(nextForm.email) ? "Ingresa un correo válido" : "",
    password: !nextForm.password ? "La contraseña es obligatoria" : !passwordRegex.test(nextForm.password) ? "Usa 8+ caracteres, una letra y un número" : "",
    confirmPassword: !nextForm.confirmPassword ? "Confirma tu contraseña" : nextForm.confirmPassword !== nextForm.password ? "Las contraseñas no coinciden" : "",
    acceptedTerms: nextForm.acceptedTerms ? "" : "Debes aceptar los términos y condiciones",
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
        title: "Registro exitoso",
        message: "Tu cuenta quedó lista. Ahora puedes iniciar sesión.",
        actionText: "Ir a iniciar sesión",
        variant: "success",
        onAction: () => {
          closeAlert();
          router.replace("/(auth)/login");
        },
      });
    } catch (error: any) {
      setAlert({
        visible: true,
        title: "No pudimos registrar tu cuenta",
        message: error?.message || "Ocurrió un problema al crear la cuenta.",
        actionText: "Intentar de nuevo",
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

      <Text style={[styles.title, { color: colors.text }]}>Crea tu cuenta</Text>

      <View style={[styles.card, { backgroundColor: "#ffffff", borderColor: colors.border }]}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.name ? "#ef4444" : "#d1d5db" }]}
          placeholder="Nombre completo"
          placeholderTextColor="#6b7280"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <Text style={styles.label}>Correo electrónico</Text>
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

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={[styles.inputPassword, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.password ? "#ef4444" : "#d1d5db" }]}
            placeholder="Mínimo 8 caracteres"
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
        {passwordStrength ? <Text style={styles.hint}>Seguridad: {passwordStrength}</Text> : null}

        <Text style={styles.label}>Confirmar contraseña</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={[styles.inputPassword, { backgroundColor: "#ffffff", color: "#111827", borderColor: errors.confirmPassword ? "#ef4444" : "#d1d5db" }]}
            placeholder="Repite tu contraseña"
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

        <TouchableOpacity style={styles.checkboxRow} onPress={() => handleChange("acceptedTerms", !form.acceptedTerms)}>
          <Ionicons name={form.acceptedTerms ? "checkbox" : "square-outline"} size={20} color={colors.primary} />
          <Text style={styles.termsLink} onPress={() => router.push("/(auth)/terms")}>Acepto los términos y condiciones</Text>
        </TouchableOpacity>
        {errors.acceptedTerms ? <Text style={styles.errorText}>{errors.acceptedTerms}</Text> : null}

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.loginText}>
        ¿Ya tienes una cuenta? <Text style={styles.loginLink} onPress={() => router.push("/(auth)/login")}>Inicia sesión</Text>
      </Text>

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
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 22,
  },
  title: {
    fontSize: 28,
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
  termsLink: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    marginTop: 12,
    borderWidth: 2,
    borderColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
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

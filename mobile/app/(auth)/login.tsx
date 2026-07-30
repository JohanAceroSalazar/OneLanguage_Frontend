import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { loginUser } from "../../src/services/authService";
import { useTheme } from "../../src/theme/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const emailRegex = /\S+@\S+\.\S+/;

export default function Login() {
  const router = useRouter();
  const { colors } = useTheme();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validate = (nextForm = form) => ({
    email: !nextForm.email.trim()
      ? "El correo es obligatorio"
      : !emailRegex.test(nextForm.email)
        ? "Ingresa un correo válido"
        : "",
    password: !nextForm.password
      ? "La contraseña es obligatoria"
      : nextForm.password.length < 6
        ? "La contraseña debe tener al menos 6 caracteres"
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
      Alert.alert("Sesión Exitosa", "Inicio de sesión exitoso.", [
        { text: "Entrar", onPress: () => router.replace("/(auth)/home") },
      ]);
    } catch (error: any) {
      Alert.alert("No se pudo iniciar sesión", error?.message || "Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.topBar}>
        <Text style={[styles.logo, { color: colors.text }]}>ONE{"\n"}LANGUAGE</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Iniciar sesión</Text>

      <Image source={require("../../assets/images/Logo.png")} style={styles.logoImg} resizeMode="contain" />

      <View style={[styles.card, { backgroundColor: "#ffffff", borderColor: colors.border }]}> 
        <Text style={styles.label}>Correo electrónico</Text>
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

        <Text style={styles.label}>Contraseña</Text>
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
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/(auth)/recover_password")}>
        <Text style={styles.link}>Restablecer contraseña</Text>
      </TouchableOpacity>

      <Text style={[styles.registerText, { color: "#ffffff" }]}> 
        ¿No tienes una cuenta? <Text style={styles.registerLink} onPress={() => router.push("/(auth)/register")}>Regístrate</Text>
      </Text>
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
  link: {
    fontSize: 15,
    marginTop: 18,
    color: "#ffffff",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  registerText: {
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

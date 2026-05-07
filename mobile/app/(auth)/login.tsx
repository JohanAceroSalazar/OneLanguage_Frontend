import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });

  const handleSubmit = () => {
    const newErrors = {
      email: !form.email,
      password: !form.password,
    };
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      setTimeout(() => setErrors({ email: false, password: false }), 3000);
      return;
    }
    // tu loginUser aquí
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ONE{"\n"}LANGUAGE</Text>

      <Text style={styles.title}>Iniciar sesión</Text>

      <Image
        source={require("../../assets/images/Logo.png")}
        style={styles.logoImg}
        resizeMode="contain"
      />

      <View style={styles.card}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="andres@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
          onChangeText={(val) => setForm({ ...form, email: val })}
        />
        {errors.email && <Text style={styles.errorText}>Este campo es obligatorio</Text>}

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={[styles.inputPassword, errors.password && styles.inputError]}
            placeholder="********"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            onChangeText={(val) => setForm({ ...form, password: val })}
          />
          <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#555" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>Este campo es obligatorio</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/(auth)/recover_password")}>
        <Text style={styles.link}>Restablecer contraseña</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        ¿No tienes una cuenta?{" "}
        <Text style={styles.registerLink} onPress={() => router.push("/(auth)/register")}>
          Regístrate
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3A78C2",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  logo: {
    position: "absolute",
    top: 30,
    left: 25,
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    lineHeight: 22,
  },
  title: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logoImg: {
    width: 300,
    height: 200,
    marginBottom: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#3A78C2",
    borderRadius: 15,
    padding: 24,
    borderWidth: 2,
    borderColor: "white",
    elevation: 6,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 14,
    color: "#2c2929",
    marginBottom: 2,
    backgroundColor: "white",
  },
  inputPassword: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingRight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 14,
    color: "#2c2929",
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "red",
    backgroundColor: "#ffcccc",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
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
    backgroundColor: "#F4DC2E",
    borderWidth: 2,
    borderColor: "black",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  link: {
    color: "white",
    fontSize: 15,
    marginTop: 20,
    textDecorationLine: "underline",
  },
  registerText: {
    color: "white",
    fontSize: 15,
    marginTop: 12,
    textAlign: "center",
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "white",
  },
});

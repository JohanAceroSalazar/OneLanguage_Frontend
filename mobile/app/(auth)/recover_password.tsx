import { useState } from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";

export default function RecoverPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);

    const handleSendCode = () => {
        if (!email.trim()) {
            setError(true);
            setTimeout(() => setError(false), 3000);
        return;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.cameraDot} />

        <Text style={styles.logo}>ONE{"\n"}LANGUAGE</Text>

    <Image
        source={require("../../assets/images/Logo.png")}
        style={styles.logoImg}
        resizeMode="contain"
    />

    <Text style={styles.title}>Restablecer{"\n"}contraseña</Text>

    <View style={styles.card}>
        <Text style={styles.label}>Correo electrónico</Text>

        <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="johan@gmail.com"
            placeholderTextColor="#777777"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
        />

        {error && <Text style={styles.errorText}>Este campo es obligatorio</Text>}

        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={handleSendCode}
        >
            <Text style={styles.buttonText}>Enviar código al correo</Text>
        </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.loginLink}>← Volver al inicio de sesión</Text>
    </TouchableOpacity>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 36,
    },
cameraDot: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#05050B",
    borderWidth: 3,
    borderColor: "#111827",
    zIndex: 5,
    },
logo: {
    alignSelf: "flex-start",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 23,
    },
logoImg: {
    width: 300,
    height: 200,
    marginTop: 70,
    marginBottom: 24,
    },
title: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 64,
    },
card: {
    width: "100%",
    maxWidth: 330,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 19,
    paddingTop: 18,
    paddingBottom: 22,
    },
label: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
    },
input: {
    width: "100%",
    height: 44,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 11,
    paddingHorizontal: 16,
    color: "#2C2929",
    fontSize: 19,
    fontWeight: "600",
    },
inputError: {
    borderColor: "red",
    backgroundColor: "#FFCCCC",
    },
errorText: {
    color: "red",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    },
button: {
    width: "100%",
    marginTop: 28,
    backgroundColor: "#FFEB3B",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    },
buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "normal",
    },
loginLink: {
    color: "#FFFFFF",
    fontSize: 15,
    marginTop: 28,
    textDecorationLine: "underline",
    },
});

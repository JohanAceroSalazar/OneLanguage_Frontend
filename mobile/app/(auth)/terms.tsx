import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Terms() {

    const router = useRouter();
    const [accepted, setAccepted] = useState(false);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        <Text style={styles.title}>Términos y condiciones</Text>

        <Text style={styles.paragraph}>
            Aplicación de Traducción de Señas a Texto
        </Text>

        <Text style={styles.paragraph}>
            Última actualización: 2025
        </Text>

        <Text style={styles.paragraph}>
            Bienvenido(a) a nuestra aplicación de traducción de señas a texto. Al utilizar la aplicación, usted acepta los presentes Términos y Condiciones.
        </Text>

        <Text style={styles.subtitle}>1. Aceptación de los Términos</Text>
        <Text style={styles.paragraph}>
            Al acceder, instalar o utilizar la Aplicación, usted declara que ha leído, comprendido y aceptado estos términos.
        </Text>

        <Text style={styles.subtitle}>2. Descripción del Servicio</Text>
        <Text style={styles.paragraph}>
            La aplicación permite capturar señas, interpretarlas mediante algoritmos y convertirlas en texto y audio.
        </Text>

        <Text style={styles.subtitle}>3. Uso Permitido</Text>
        <Text style={styles.paragraph}>
            El usuario se compromete a usar la aplicación de forma responsable, sin fines ilegales ni maliciosos.
        </Text>

        <Text style={styles.subtitle}>4. Registro y Seguridad</Text>
        <Text style={styles.paragraph}>
            El usuario debe proporcionar información verídica y proteger sus credenciales.
        </Text>

        <Text style={styles.subtitle}>5. Privacidad</Text>
        <Text style={styles.paragraph}>
            Los datos recopilados se utilizan únicamente para mejorar la experiencia del usuario.
        </Text>

        <Text style={styles.subtitle}>6. Propiedad Intelectual</Text>
        <Text style={styles.paragraph}>
            Todo el contenido de la aplicación pertenece a sus desarrolladores.
        </Text>

        <Text style={styles.subtitle}>7. Limitación de Responsabilidad</Text>
        <Text style={styles.paragraph}>
            La aplicación puede tener errores y no garantiza precisión total.
        </Text>

    <View style={styles.checkboxContainer}>

        <TouchableOpacity 
            onPress={() => {
                setAccepted(true);// marca como aceptado
                setTimeout(() => {
                    router.back();// vuelve a Register
                }, 300);// pequeño delay para que se vea el check
            }}
            >
        <Ionicons
        //icono tipo FaCheckSquare
            name={accepted ? "checkbox" : "square-outline"} 
            size={24}
            color={accepted ? "green" : "black"}
        />
    </TouchableOpacity>

        <Text style={styles.checkboxText}>
            Acepto los términos y condiciones
        </Text>
    </View>

    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#000",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 5,
        color: "#000",
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
        color: "#000",
    },
    // estilos checkbox
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
    },
    checkboxText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#000",
    },
});
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/ThemeContext";

export default function Terms() {

    const router = useRouter();
    const { colors, fontScale } = useTheme();
    const [accepted, setAccepted] = useState(false);

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
            <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surface }]} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color={colors.textOnSurface} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text, fontSize: 24 * fontScale }]}>Términos y condiciones</Text>
        </View>

        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            Aplicación de Traducción de Señas a Texto
        </Text>

        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            Última actualización: 2025
        </Text>

        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            Bienvenido(a) a nuestra aplicación de traducción de señas a texto. Al utilizar la aplicación, usted acepta los presentes Términos y Condiciones.
        </Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>1. Aceptación de los Términos</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            Al acceder, instalar o utilizar la Aplicación, usted declara que ha leído, comprendido y aceptado estos términos.
        </Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>2. Descripción del Servicio</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            La aplicación permite capturar señas, interpretarlas mediante algoritmos y convertirlas en texto y audio.
        </Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>3. Uso Permitido</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            El usuario se compromete a usar la aplicación de forma responsable, sin fines ilegales ni maliciosos.
        </Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>4. Registro y Seguridad</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            El usuario debe proporcionar información verídica y proteger sus credenciales.
        </Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>5. Privacidad</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            Los datos recopilados se utilizan únicamente para mejorar la experiencia del usuario.
        </Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>6. Propiedad Intelectual</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            Todo el contenido de la aplicación pertenece a sus desarrolladores.
        </Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>7. Limitación de Responsabilidad</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}> 
            La aplicación puede tener errores y no garantiza precisión total.
        </Text>
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
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        backgroundColor: "#f3f4f6",
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { BottomNav } from "../../components/bottom-nav";
import { useTheme } from "../../src/theme/ThemeContext";

export default function History() {
    const { colors, fontScale } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.cameraDot} />

        <Text style={[styles.logo, { color: colors.text, fontSize: 20 * fontScale }]}>ONE{"\n"}LANGUAGE</Text>

    <View style={styles.headerText}>
        <Text style={[styles.title, { color: colors.text, fontSize: 23 * fontScale }]}>Historial de traducción</Text>
        <Text style={[styles.subtitle, { color: "#FFFFFF", fontSize: 14 * fontScale }]}>Revisa tus traducciones anteriores</Text>
    </View>

    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Ionicons name="camera-outline" size={42} color={colors.primary} />

        <Text style={[styles.emptyTitle, { color: colors.textOnSurface, fontSize: 22 * fontScale }]}>No hay traducciones</Text>

        <Text style={[styles.emptyText, { color: colors.textOnSurface, fontSize: 22 * fontScale }]}> 
            Comienza a usar el{"\n"}reconocimiento de{"\n"}señas para guardar{"\n"}
            traducciones.
        </Text>
    </View>

        <BottomNav active="history" />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    paddingHorizontal: 22,
    paddingTop: 30,
    },
cameraDot: {
    position: "absolute",
    top: 10,
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
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
    marginLeft: 8,
    },
headerText: {
    marginTop: 46,
    marginLeft: 10,
    },
title: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
    lineHeight: 28,
    },
subtitle: {
    color: "#6E6574",
    fontSize: 14,
    marginTop: 2,
    },
card: {
    width: "100%",
    minHeight: 400,
    marginTop: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#6E6574",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 28,
    },
emptyTitle: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "400",
    marginTop: 45,
    textAlign: "center",
    },
emptyText: {
    color: "#000000",
    fontSize: 22,
    lineHeight: 31,
    fontWeight: "400",
    marginTop: 32,
    textAlign: "center",
    },
});

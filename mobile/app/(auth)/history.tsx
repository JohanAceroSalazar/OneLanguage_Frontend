import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { BottomNav } from "../../components/bottom-nav";

export default function History() {
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.cameraDot} />

        <Text style={styles.logo}>ONE{"\n"}LANGUAGE</Text>

    <View style={styles.headerText}>
        <Text style={styles.title}>Historial de traducción</Text>
        <Text style={styles.subtitle}>Revisa tus traducciones anteriores</Text>
    </View>

    <View style={styles.card}>
        <Ionicons name="camera-outline" size={42} color="#000000" />

        <Text style={styles.emptyTitle}>No hay traducciones</Text>

        <Text style={styles.emptyText}>
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
    color: "#FFFFFF",
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

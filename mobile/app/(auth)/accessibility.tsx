import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomNav } from "../../components/bottom-nav";

type OptionRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    buttonText: string;
    largeIcon?: boolean;
};

function OptionRow({ icon, title, buttonText, largeIcon }: OptionRowProps) {
    return (
    <View style={styles.optionRow}>
    <Ionicons
        name={icon}
        size={largeIcon ? 56 : 46}
        color="#000000"
        style={styles.optionIcon}
    />
    <Text style={styles.optionText}>{title}</Text>
    <TouchableOpacity activeOpacity={0.85} style={styles.smallButton}>
        <Text style={styles.smallButtonText}>{buttonText}</Text>
    </TouchableOpacity>
    </View>
    );
}

export default function Accessibility() {
return (
    <SafeAreaView style={styles.container}>
        <View style={styles.cameraDot} />

        <Text style={styles.logo}>ONE{"\n"}LANGUAGE</Text>

        <Text style={styles.title}>Accesibilidad</Text>

    <View style={styles.card}>
        <OptionRow icon="text-outline" title="Ajustar texto" buttonText="Ajustar" largeIcon />
        <OptionRow icon="color-palette-outline" title={"Elige\ntu modo"} buttonText="Ajustar" />
        <OptionRow icon="globe-outline" title="Idioma" buttonText="Cambiar" />

        <TouchableOpacity activeOpacity={0.85} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
    </View>

        <BottomNav active="accessibility" />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    paddingHorizontal: 20,
    paddingTop: 20,
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
    lineHeight: 20,
    marginLeft: 8,
    },
title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 85,
    marginLeft: 8,
    },
card: {
    width: "100%",
    marginTop: 70,
    minHeight: 405,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#6E6574",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 32,
    },
optionRow: {
    width: "100%",
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    },
optionIcon: {
    width: 54,
    textAlign: "center",
    },
optionText: {
    flex: 1,
    color: "#000000",
    fontSize: 21,
    lineHeight: 23,
    fontWeight: "500",
    marginLeft: 14,
    },
smallButton: {
    width: 72,
    height: 40,
    backgroundColor: "#FFEB3B",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    },
smallButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
    },
saveButton: {
    width: "92%",
    alignSelf: "center",
    marginTop: 36,
    backgroundColor: "#FFEB3B",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 13,
    },
saveButtonText: {
    color: "#000000",
    fontSize: 27,
    fontWeight: "bold",
    },
});

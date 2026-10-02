import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/bottom-nav";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";

export default function History() {
    const { t } = useTranslation();
    const { colors, fontScale } = useTheme();

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.logo, { color: colors.text, fontSize: 20 * fontScale }]}>ONE{"\n"}LANGUAGE</Text>

    <View style={styles.headerText}>
        <Text style={[styles.title, { color: colors.text, fontSize: 23 * fontScale }]}>{t("history.title")}</Text>
        <Text style={[styles.subtitle, { color: "#FFFFFF", fontSize: 14 * fontScale }]}>{t("history.subtitle")}</Text>
    </View>

    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Ionicons name="camera-outline" size={42} color={colors.primary} />

        <Text style={[styles.emptyTitle, { color: colors.textOnSurface, fontSize: 22 * fontScale }]}>{t("history.empty")}</Text>

        <Text style={[styles.emptyText, { color: colors.textOnSurface, fontSize: 22 * fontScale }]}> 
            Comienza a usar el{"\n"}reconocimiento de{"\n"}señas para guardar{"\n"}
            traducciones.
        </Text>
    </View>
        </ScrollView>
        <BottomNav active="history" />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#2F78CC",
    },
content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 118,
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

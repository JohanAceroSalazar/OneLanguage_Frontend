import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";

export default function Terms() {
    const { t } = useTranslation();

    const router = useRouter();
    const { colors, fontScale } = useTheme();
    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
            <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surface }]} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color={colors.textOnSurface} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text, fontSize: 24 * fontScale }]}>{t("terms.title")}</Text>
        </View>

        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.app")}</Text>

        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.updated")}</Text>

        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.welcome")}</Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>{t("terms.s1")}</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.p1")}</Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>{t("terms.s2")}</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.p2")}</Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>{t("terms.s3")}</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.p3")}</Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>{t("terms.s4")}</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.p4")}</Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>{t("terms.s5")}</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.p5")}</Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>{t("terms.s6")}</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.p6")}</Text>

        <Text style={[styles.subtitle, { color: colors.text, fontSize: 16 * fontScale }]}>{t("terms.s7")}</Text>
        <Text style={[styles.paragraph, { color: colors.text, fontSize: 14 * fontScale }]}>{t("terms.p7")}</Text>
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



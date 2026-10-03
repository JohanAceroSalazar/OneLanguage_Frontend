import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNav } from "../../components/bottom-nav";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import {
    deleteAllTranslations,
    deleteTranslation,
    getTranslations,
    Translation,
} from "../../src/services/translationService";

export default function History() {
    const { t } = useTranslation();
    const { colors, fontScale } = useTheme();
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadTranslations = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            setTranslations(await getTranslations());
        } catch {
            setError(t("history.loadError"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useFocusEffect(useCallback(() => {
        loadTranslations();
    }, [loadTranslations]));

    const removeOne = (translation: Translation) => {
        Alert.alert(t("history.delete"), translation.translatedText, [
            { text: t("history.cancel"), style: "cancel" },
            {
                text: t("history.delete"),
                style: "destructive",
                onPress: async () => {
                    setDeletingId(translation.id);
                    try {
                        await deleteTranslation(translation.id);
                        setTranslations((current) => current.filter((item) => item.id !== translation.id));
                    } catch {
                        setError(t("history.deleteError"));
                    } finally {
                        setDeletingId(null);
                    }
                },
            },
        ]);
    };

    const removeAll = () => {
        Alert.alert(t("history.deleteAll"), t("history.deleteAllConfirm"), [
            { text: t("history.cancel"), style: "cancel" },
            {
                text: t("history.deleteAll"),
                style: "destructive",
                onPress: async () => {
                    setDeletingId("all");
                    try {
                        await deleteAllTranslations();
                        setTranslations([]);
                    } catch {
                        setError(t("history.deleteError"));
                    } finally {
                        setDeletingId(null);
                    }
                },
            },
        ]);
    };

    const formatDate = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return t("history.dateUnavailable");
        return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
    };

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.logo, { color: colors.text, fontSize: 20 * fontScale }]}>ONE{"\n"}LANGUAGE</Text>

    <View style={styles.headerText}>
        <Text style={[styles.title, { color: colors.text, fontSize: 23 * fontScale }]}>{t("history.title")}</Text>
        <Text style={[styles.subtitle, { color: "#FFFFFF", fontSize: 14 * fontScale }]}>{t("history.subtitle")}</Text>
    </View>

    {error ? <Text style={styles.errorText}>{error}</Text> : null}
    {loading ? <View style={styles.loading}><ActivityIndicator color={colors.accent} size="large" /></View> : null}
    {!loading && translations.length === 0 ? <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="camera-outline" size={42} color={colors.primary} />
        <Text style={[styles.emptyTitle, { color: colors.textOnSurface, fontSize: 22 * fontScale }]}>{t("history.empty")}</Text>
        <Text style={[styles.emptyText, { color: colors.textOnSurface, fontSize: 17 * fontScale }]}>{t("history.emptyText")}</Text>
    </View> : null}
    {!loading && translations.length > 0 ? <View style={styles.historyList}>
        <View style={styles.listHeader}>
            <Text style={[styles.countText, { color: colors.text }]}>{t("history.count", { count: translations.length })}</Text>
            <TouchableOpacity disabled={deletingId !== null} onPress={removeAll} style={styles.deleteAllButton}>
                {deletingId === "all" ? <ActivityIndicator color="#ffffff" /> : <Ionicons name="trash-outline" size={22} color="#ffffff" />}
            </TouchableOpacity>
        </View>
        {translations.map((translation) => <View key={translation.id} style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.itemIcon}><Ionicons name="hand-left-outline" size={24} color="#ffffff" /></View>
            <View style={styles.itemContent}>
                <Text style={[styles.itemText, { color: colors.textOnSurface }]}>{translation.translatedText}</Text>
                <Text style={[styles.itemDate, { color: colors.textOnSurface }]}>{formatDate(translation.createdAt)}</Text>
            </View>
            <TouchableOpacity disabled={deletingId !== null} onPress={() => removeOne(translation)} style={styles.deleteButton}>
                {deletingId === translation.id ? <ActivityIndicator color="#b91c1c" /> : <Ionicons name="trash-outline" size={22} color="#b91c1c" />}
            </TouchableOpacity>
        </View>)}
    </View> : null}
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
    marginTop: 34,
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
    minHeight: 330,
    marginTop: 42,
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
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400",
    marginTop: 32,
    textAlign: "center",
    },
loading: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    },
errorText: {
    color: "#fee2e2",
    backgroundColor: "#991b1b",
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
    },
historyList: {
    width: "100%",
    marginTop: 28,
    gap: 10,
    },
listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    },
countText: { fontSize: 15, fontWeight: "600" },
deleteAllButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    },
historyItem: {
    minHeight: 86,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    },
itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#2866a8",
    alignItems: "center",
    justifyContent: "center",
    },
itemContent: { flex: 1, paddingHorizontal: 12 },
itemText: { fontSize: 17, fontWeight: "700" },
itemDate: { fontSize: 12, opacity: 0.65, marginTop: 5 },
deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    },
});

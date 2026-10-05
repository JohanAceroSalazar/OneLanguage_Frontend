import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppAlert } from "../../components/app-alert";
import { BottomNav } from "../../components/bottom-nav";
import { useTheme } from "../../src/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import i18n, { languageOptions, setLanguage } from "../../src/i18n";
import { persistLocalAccessibilitySettings, updateAccessibilitySettings } from "../../src/services/authService";

type DropdownOption = {
    label: string;
    value: string;
};

function Dropdown({ title, icon, options, selectedValue, onSelect, accentColor, textColor, borderColor, menuBackgroundColor, menuTextColor, selectedBackgroundColor, selectedTextColor, open, onToggle }: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    options: DropdownOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
    accentColor: string;
    textColor: string;
    borderColor: string;
    menuBackgroundColor: string;
    menuTextColor: string;
    selectedBackgroundColor: string;
    selectedTextColor: string;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <View style={styles.optionRow}>
            <Ionicons name={icon} size={46} color={accentColor} style={styles.optionIcon} />
            <View style={styles.optionContent}>
                <Text style={[styles.optionText, { color: textColor }]}>{title}</Text>
                <TouchableOpacity activeOpacity={0.9} style={[styles.dropdownButton, { backgroundColor: accentColor }]} onPress={onToggle}>
                    <Text style={[styles.dropdownButtonText, { color: "#111827" }]}>{selectedValue}</Text>
                    <Ionicons name="chevron-down" size={18} color="#111827" />
                </TouchableOpacity>
                {open ? (
                    <View style={[styles.dropdownMenu, { borderColor, backgroundColor: menuBackgroundColor }]}> 
                        {options.map((option) => {
                            const isSelected = option.label === selectedValue;
                            return (
                                <TouchableOpacity key={option.value} style={[styles.dropdownItem, isSelected && { backgroundColor: selectedBackgroundColor }]} onPress={() => onSelect(option.value)}>
                                    <Text style={[styles.dropdownItemText, { color: isSelected ? selectedTextColor : menuTextColor }]}>{option.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : null}
            </View>
        </View>
    );
}

export default function Accessibility() {
    const { colors, theme, fontScale, fontSizeMode, setThemeMode, setFontSizeMode } = useTheme();
    const [draftFontSize, setDraftFontSize] = useState(fontSizeMode);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<"font" | "theme" | "language" | null>(null);
    const { t, i18n: translationI18n } = useTranslation();
    const selectedLanguage = (translationI18n.resolvedLanguage || translationI18n.language || "es").split("-")[0];

    const fontOptions = useMemo<DropdownOption[]>(() => [
        { label: t("accessibility.small"), value: "small" },
        { label: t("accessibility.medium"), value: "medium" },
        { label: t("accessibility.large"), value: "large" },
    ], [t]);

    const themeOptions = useMemo<DropdownOption[]>(() => [
        { label: t("accessibility.light"), value: "light" },
        { label: t("accessibility.dark"), value: "dark" },
    ], [t]);

    const languageDropdownOptions = useMemo<DropdownOption[]>(() => languageOptions.map((option) => ({
        label: option.label,
        value: option.code,
    })), []);

    const selectedFontLabel = fontOptions.find((option) => option.value === draftFontSize)?.label ?? t("accessibility.medium");
    const selectedThemeLabel = themeOptions.find((option) => option.value === theme)?.label ?? t("accessibility.light");
    const selectedLanguageLabel = languageDropdownOptions.find((option) => option.value === selectedLanguage)?.label
        ?? languageDropdownOptions[0].label;

    const handleSave = async () => {
        setThemeMode(theme);
        setFontSizeMode(draftFontSize);
        setShowSuccess(false);
        setShowError(false);
        try {
            await updateAccessibilitySettings({
                language: i18n.language as "es" | "en" | "pt" | "it",
                textSize: draftFontSize,
                theme,
            });
        } catch {
            await persistLocalAccessibilitySettings({
                language: translationI18n.language as "es" | "en" | "pt" | "it",
                textSize: draftFontSize,
                theme,
            });
            setShowError(true);
            return;
        }
        await persistLocalAccessibilitySettings({
            language: translationI18n.language as "es" | "en" | "pt" | "it",
            textSize: draftFontSize,
            theme,
        });
        setShowSuccess(true);
    };

    return (
        <SafeAreaView edges={["top", "left", "right"]} style={[styles.container, { backgroundColor: colors.background }]}>
        <Pressable style={styles.pressable} onPress={() => setOpenDropdown(null)}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[styles.logo, { color: colors.text }]}>ONE{"\n"}LANGUAGE</Text>
            <Text style={[styles.title, { color: colors.text, fontSize: 30 * fontScale }]}>{t("accessibility.title")}</Text>

            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Dropdown
                    title={t("misc.textSize")}
                    icon="text-outline"
                    options={fontOptions}
                    selectedValue={selectedFontLabel}
                    onSelect={(value) => {
                        const nextFontSize = value as typeof draftFontSize;
                        setDraftFontSize(nextFontSize);
                        setFontSizeMode(nextFontSize);
                        setOpenDropdown(null);
                    }}
                    accentColor={colors.accent}
                    textColor={colors.textOnSurface}
                    borderColor={colors.border}
                    menuBackgroundColor={theme === "dark" ? "#111827" : "#ffffff"}
                    menuTextColor={theme === "dark" ? "#f8fafc" : "#111827"}
                    selectedBackgroundColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
                    selectedTextColor={theme === "dark" ? "#f4dc2e" : "#111827"}
                    open={openDropdown === "font"}
                    onToggle={() => setOpenDropdown((current) => current === "font" ? null : "font")}
                />

                <Dropdown
                    title={t("accessibility.visual")}
                    icon="color-palette-outline"
                    options={themeOptions}
                    selectedValue={selectedThemeLabel}
                    onSelect={(value) => {
                        const nextTheme = value as typeof theme;
                        setThemeMode(nextTheme);
                        setOpenDropdown(null);
                    }}
                    accentColor={colors.accent}
                    textColor={colors.textOnSurface}
                    borderColor={colors.border}
                    menuBackgroundColor={theme === "dark" ? "#111827" : "#ffffff"}
                    menuTextColor={theme === "dark" ? "#f8fafc" : "#111827"}
                    selectedBackgroundColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
                    selectedTextColor={theme === "dark" ? "#f4dc2e" : "#111827"}
                    open={openDropdown === "theme"}
                    onToggle={() => setOpenDropdown((current) => current === "theme" ? null : "theme")}
                />

                <Dropdown
                    title={t("accessibility.language")}
                    icon="globe-outline"
                    options={languageDropdownOptions}
                    selectedValue={selectedLanguageLabel}
                    onSelect={(value) => {
                        void setLanguage(value);
                        void persistLocalAccessibilitySettings({ language: value as "es" | "en" | "pt" | "it" });
                        setOpenDropdown(null);
                    }}
                    accentColor={colors.accent}
                    textColor={colors.textOnSurface}
                    borderColor={colors.border}
                    menuBackgroundColor={theme === "dark" ? "#111827" : "#ffffff"}
                    menuTextColor={theme === "dark" ? "#f8fafc" : "#111827"}
                    selectedBackgroundColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
                    selectedTextColor={theme === "dark" ? "#f4dc2e" : "#111827"}
                    open={openDropdown === "language"}
                    onToggle={() => setOpenDropdown((current) => current === "language" ? null : "language")}
                />

                <TouchableOpacity activeOpacity={0.85} style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{t("accessibility.save")}</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>

            <BottomNav active="accessibility" />

            <AppAlert
                visible={showSuccess}
                label={t("common.ok")}
                title={t("accessibility.changesSavedTitle")}
                message={t("accessibility.saved")}
                actionText={t("common.ok")}
                variant="success"
                onAction={() => setShowSuccess(false)}
            />
            <AppAlert
                visible={showError}
                label={t("common.ok")}
                title={t("accessibility.changesSavedTitle")}
                message={t("accessibility.saveError")}
                actionText={t("common.ok")}
                variant="error"
                onAction={() => setShowError(false)}
            />
        </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pressable: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 118,
    },
    logo: {
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 20,
        marginLeft: 8,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 70,
        marginLeft: 8,
    },
    card: {
        width: "100%",
        marginTop: 60,
        minHeight: 405,
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
    optionContent: {
        flex: 1,
        marginLeft: 14,
    },
    optionIcon: {
        width: 54,
        textAlign: "center",
    },
    optionText: {
        flex: 1,
        fontSize: 21,
        lineHeight: 23,
        fontWeight: "500",
        marginBottom: 8,
    },
    dropdownButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 6,
        shadowColor: "#06142B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 7,
        elevation: 2,
    },
    dropdownButtonText: {
        color: "#111827",
        fontSize: 14,
        fontWeight: "600",
    },
    dropdownMenu: {
        borderWidth: 1,
        borderRadius: 10,
        overflow: "hidden",
    },
    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    dropdownItemText: {
        fontSize: 14,
        fontWeight: "500",
    },
    saveButton: {
        width: "92%",
        alignSelf: "center",
        marginTop: 36,
        borderRadius: 15,
        alignItems: "center",
        paddingVertical: 13,
        shadowColor: "#06142B",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    saveButtonText: {
        color: "#000000",
        fontSize: 27,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    modalBox: {
        width: "84%",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },
    modalText: {
        fontSize: 15,
        textAlign: "center",
        marginBottom: 16,
    },
    modalButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
    },
    modalButtonText: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "700",
    },
});

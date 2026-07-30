import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Alert, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomNav } from "../../components/bottom-nav";
import { useTheme } from "../../src/theme/ThemeContext";

type DropdownOption = {
    label: string;
    value: string;
};

function Dropdown({ title, icon, options, selectedValue, onSelect, accentColor, textColor, borderColor, menuBackgroundColor, menuTextColor, selectedBackgroundColor, selectedTextColor }: {
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
}) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.optionRow}>
            <Ionicons name={icon} size={46} color={accentColor} style={styles.optionIcon} />
            <View style={styles.optionContent}>
                <Text style={[styles.optionText, { color: textColor }]}>{title}</Text>
                <TouchableOpacity activeOpacity={0.9} style={[styles.dropdownButton, { borderColor, backgroundColor: accentColor }]} onPress={() => setOpen((value) => !value)}>
                    <Text style={[styles.dropdownButtonText, { color: "#111827" }]}>{selectedValue}</Text>
                    <Ionicons name="chevron-down" size={18} color="#111827" />
                </TouchableOpacity>
                {open ? (
                    <View style={[styles.dropdownMenu, { borderColor, backgroundColor: menuBackgroundColor }]}> 
                        {options.map((option) => {
                            const isSelected = option.label === selectedValue;
                            return (
                                <TouchableOpacity key={option.value} style={[styles.dropdownItem, isSelected && { backgroundColor: selectedBackgroundColor }]} onPress={() => { onSelect(option.value); setOpen(false); }}>
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
    const [draftTheme, setDraftTheme] = useState(theme);
    const [draftFontSize, setDraftFontSize] = useState(fontSizeMode);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setDraftTheme(theme);
        setDraftFontSize(fontSizeMode);
    }, [theme, fontSizeMode]);

    const fontOptions = useMemo<DropdownOption[]>(() => [
        { label: "Pequeño", value: "small" },
        { label: "Mediano", value: "medium" },
        { label: "Grande", value: "large" },
    ], []);

    const themeOptions = useMemo<DropdownOption[]>(() => [
        { label: "Claro", value: "light" },
        { label: "Oscuro", value: "dark" },
    ], []);

    const selectedFontLabel = fontOptions.find((option) => option.value === draftFontSize)?.label ?? "Mediano";
    const selectedThemeLabel = themeOptions.find((option) => option.value === draftTheme)?.label ?? "Claro";

    const handleSave = () => {
        setThemeMode(draftTheme);
        setFontSizeMode(draftFontSize);
        setShowSuccess(true);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <View style={styles.cameraDot} />
            <Text style={[styles.logo, { color: colors.text }]}>ONE{"\n"}LANGUAGE</Text>
            <Text style={[styles.title, { color: colors.text, fontSize: 30 * fontScale }]}>Accesibilidad</Text>

            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Dropdown
                    title="Tamaño de texto"
                    icon="text-outline"
                    options={fontOptions}
                    selectedValue={selectedFontLabel}
                    onSelect={(value) => setDraftFontSize(value as typeof draftFontSize)}
                    accentColor={colors.accent}
                    textColor={colors.textOnSurface}
                    borderColor={colors.border}
                    menuBackgroundColor={theme === "dark" ? "#111827" : "#ffffff"}
                    menuTextColor={theme === "dark" ? "#f8fafc" : "#111827"}
                    selectedBackgroundColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
                    selectedTextColor={theme === "dark" ? "#f4dc2e" : "#111827"}
                />

                <Dropdown
                    title="Tema visual"
                    icon="color-palette-outline"
                    options={themeOptions}
                    selectedValue={selectedThemeLabel}
                    onSelect={(value) => setDraftTheme(value as typeof draftTheme)}
                    accentColor={colors.accent}
                    textColor={colors.textOnSurface}
                    borderColor={colors.border}
                    menuBackgroundColor={theme === "dark" ? "#111827" : "#ffffff"}
                    menuTextColor={theme === "dark" ? "#f8fafc" : "#111827"}
                    selectedBackgroundColor={theme === "dark" ? "#1f2937" : "#f3f4f6"}
                    selectedTextColor={theme === "dark" ? "#f4dc2e" : "#111827"}
                />

                <View style={styles.optionRow}>
                    <Ionicons name="globe-outline" size={46} color={colors.accent} style={styles.optionIcon} />
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionText, { color: colors.textOnSurface }]}>Idioma</Text>
                        <TouchableOpacity activeOpacity={0.9} style={[styles.dropdownButton, { borderColor: colors.border, backgroundColor: colors.accent }]}> 
                            <Text style={styles.dropdownButtonText}>Español</Text>
                            <Ionicons name="chevron-down" size={18} color="#111827" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity activeOpacity={0.85} style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Guardar cambios</Text>
                </TouchableOpacity>
            </View>

            <BottomNav active="accessibility" />

            <Modal transparent visible={showSuccess} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.surface }]}> 
                        <Text style={[styles.modalTitle, { color: colors.textOnSurface }]}>Cambios de accesibilidad</Text>
                        <Text style={[styles.modalText, { color: colors.textOnSurface }]}>Guardados correctamente</Text>
                        <TouchableOpacity activeOpacity={0.9} style={[styles.modalButton, { backgroundColor: colors.accent }]} onPress={() => setShowSuccess(false)}>
                            <Text style={styles.modalButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderWidth: 1,
        marginBottom: 6,
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

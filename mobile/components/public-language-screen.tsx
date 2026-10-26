import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { createInstance } from "i18next";
import { ComponentType, useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { languageOptions, text } from "../src/i18n";

const STORAGE_KEY = "publicLanguage";
const publicI18n = createInstance();
void publicI18n.init({ resources: text, lng: "es", fallbackLng: "es", interpolation: { escapeValue: false } });

export function PublicLanguagePicker() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = i18n.language;
  const active = languageOptions.find(({ code }) => code === selected) || languageOptions[0];

  const changeLanguage = (language: string) => {
    void AsyncStorage.setItem(STORAGE_KEY, language);
    void i18n.changeLanguage(language);
    setOpen(false);
  };

  return <>
    <TouchableOpacity
      style={styles.trigger}
      accessibilityRole="button"
      accessibilityLabel={`${t("accessibility.language")}: ${active.label}`}
      onPress={() => setOpen(true)}
    >
      <Ionicons name="globe-outline" size={18} color="#FFFFFF" />
      <Text style={styles.triggerText}>{active.code.toUpperCase()}</Text>
      <Ionicons name="chevron-down" size={14} color="#FFFFFF" />
    </TouchableOpacity>
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>{t("accessibility.language")}</Text>
          {languageOptions.map(({ code, label }) => <TouchableOpacity
            key={code}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === code }}
            accessibilityLabel={label}
            onPress={() => changeLanguage(code)}
            style={[styles.option, selected === code && styles.selected]}
          >
            <Text style={styles.optionText}>{label}</Text>
            {selected === code && <Ionicons name="checkmark" size={20} color="#285F9F" />}
          </TouchableOpacity>)}
        </View>
      </View>
    </Modal>
  </>;
}

export function withPublicLanguage<P extends object>(Screen: ComponentType<P>) {
  return function PublicLanguageScreen(props: P) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
      let active = true;
      AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
        const language = languageOptions.some(({ code }) => code === stored) ? stored! : "es";
        return publicI18n.changeLanguage(language);
      }).finally(() => { if (active) setReady(true); });
      return () => { active = false; };
    }, []);

    if (!ready) return null;
    return <I18nextProvider i18n={publicI18n}>
      <View style={styles.container}><Screen {...props} /></View>
    </I18nextProvider>;
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#3A78C2" },
  trigger: { minHeight: 38, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: "#BDD6F3", backgroundColor: "#285F9F" },
  triggerText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  backdrop: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "rgba(0, 0, 0, 0.45)" },
  menu: { width: "100%", maxWidth: 320, padding: 16, borderRadius: 8, backgroundColor: "#FFFFFF" },
  menuTitle: { marginBottom: 10, color: "#071429", fontSize: 18, fontWeight: "700" },
  option: { minHeight: 46, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, borderRadius: 5 },
  selected: { backgroundColor: "#E7F0FA" },
  optionText: { color: "#071429", fontSize: 15, fontWeight: "600" },
});

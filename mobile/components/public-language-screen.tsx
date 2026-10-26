import AsyncStorage from "@react-native-async-storage/async-storage";
import { createInstance } from "i18next";
import { ComponentType, useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { languageOptions, text } from "../src/i18n";

const STORAGE_KEY = "publicLanguage";
const publicI18n = createInstance();
void publicI18n.init({ resources: text, lng: "es", fallbackLng: "es", interpolation: { escapeValue: false } });

function LanguageFooter() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.language);

  const changeLanguage = (language: string) => {
    setSelected(language);
    void AsyncStorage.setItem(STORAGE_KEY, language);
    void i18n.changeLanguage(language);
  };

  return <View style={styles.footer}>
    <Text style={styles.label}>{t("accessibility.language")}</Text>
    <View style={styles.options}>
      {languageOptions.map(({ code, label }) => <TouchableOpacity
        key={code}
        accessibilityRole="button"
        accessibilityState={{ selected: selected === code }}
        accessibilityLabel={label}
        onPress={() => changeLanguage(code)}
        style={[styles.option, selected === code && styles.selected]}
      ><Text style={[styles.optionText, selected === code && styles.selectedText]}>{code.toUpperCase()}</Text></TouchableOpacity>)}
    </View>
  </View>;
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
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <View style={styles.content}><Screen {...props} /></View>
        <LanguageFooter />
      </SafeAreaView>
    </I18nextProvider>;
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#3A78C2" },
  content: { flex: 1, minHeight: 0 },
  footer: { minHeight: 58, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#285F9F" },
  label: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  options: { flexDirection: "row", gap: 5 },
  option: { minWidth: 40, minHeight: 34, justifyContent: "center", alignItems: "center", borderRadius: 4, borderWidth: 1, borderColor: "#BDD6F3" },
  selected: { backgroundColor: "#FBE532", borderColor: "#FBE532" },
  optionText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  selectedText: { color: "#06142B" },
});

import { PropsWithChildren, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { I18nextProvider } from "react-i18next";
import i18n, { loadLanguage } from "./i18n";

export default function I18nProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  useEffect(() => { loadLanguage().finally(() => setReady(true)); }, []);
  if (!ready) return <View><Text>Loading...</Text></View>;
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

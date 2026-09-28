import { Stack } from "expo-router";
import { ThemeProvider } from "../src/theme/ThemeContext";
import I18nProvider from "../src/i18nProvider";

export default function AuthLayout() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </I18nProvider>
  );
}

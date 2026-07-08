import { Stack } from "expo-router";
import { ThemeProvider } from "../src/theme/ThemeContext";

export default function AuthLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
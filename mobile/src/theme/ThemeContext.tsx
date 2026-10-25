import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getLocalAccessibilitySettings, persistLocalAccessibilitySettings } from "../services/authService";

type ThemeMode = "light" | "dark";
type FontSizeMode = "small" | "medium" | "large";

type ThemeContextValue = {
  theme: ThemeMode;
  fontSizeMode: FontSizeMode;
  fontScale: number;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setFontSizeMode: (mode: FontSizeMode) => void;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textOnSurface: string;
    textMuted: string;
    primary: string;
    primaryStrong: string;
    navigation: string;
    border: string;
    accent: string;
    accentText: string;
    shadow: string;
  };
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const lightColors = {
  background: "#3a78c2",
  surface: "#ffffff",
  surfaceAlt: "#f9f9f9",
  text: "#ffffff",
  textOnSurface: "#0f172a",
  textMuted: "#5f6b7a",
  primary: "#3a78c2",
  primaryStrong: "#2f68b4",
  navigation: "#2a5fa0",
  border: "#cbd5e1",
  accent: "#F4DC2E",
  accentText: "#0f172a",
  shadow: "rgba(6, 20, 43, 0.2)",
};

const darkColors = {
  background: "#081220",
  surface: "#111827",
  surfaceAlt: "#1f2937",
  text: "#f8fafc",
  textOnSurface: "#e5eef9",
  textMuted: "#a7b3c4",
  primary: "#081220",
  primaryStrong: "#0f172a",
  navigation: "#15294a",
  border: "rgba(148, 163, 184, 0.24)",
  accent: "#f4dc2e",
  accentText: "#111827",
  shadow: "rgba(0, 0, 0, 0.38)",
};

const fontScaleMap: Record<FontSizeMode, number> = {
  small: 0.92,
  medium: 1,
  large: 1.08,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [fontSizeMode, setFontSizeModeState] = useState<FontSizeMode>("medium");
  const [loaded, setLoaded] = useState(false);
  const settingsVersion = useRef(0);

  useEffect(() => {
    const requestVersion = settingsVersion.current;
    getLocalAccessibilitySettings()
      .then((settings) => {
        if (requestVersion !== settingsVersion.current) return;
        setTheme(settings.theme);
        setFontSizeModeState(settings.textSize);
      })
      .finally(() => setLoaded(true));
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    settingsVersion.current += 1;
    setTheme(mode);
  }, []);

  const setFontSizeMode = useCallback((mode: FontSizeMode) => {
    settingsVersion.current += 1;
    setFontSizeModeState(mode);
  }, []);

  useEffect(() => {
    if (loaded) void persistLocalAccessibilitySettings({ theme });
  }, [loaded, theme]);

  useEffect(() => {
    if (loaded) void persistLocalAccessibilitySettings({ textSize: fontSizeMode });
  }, [fontSizeMode, loaded]);

  const value = useMemo(() => ({
    theme,
    fontSizeMode,
    fontScale: fontScaleMap[fontSizeMode],
    toggleTheme: () => setThemeMode(theme === "light" ? "dark" : "light"),
    setThemeMode,
    setFontSizeMode,
    colors: theme === "light" ? lightColors : darkColors,
  }), [fontSizeMode, setFontSizeMode, setThemeMode, theme]);

  if (!loaded) return null;
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

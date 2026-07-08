import React, { createContext, useContext, useMemo, useState } from "react";

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
    border: string;
    accent: string;
    shadow: string;
  };
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const lightColors = {
  background: "#3A78C2",
  surface: "#ffffff",
  surfaceAlt: "#f5f8ff",
  text: "#ffffff",
  textOnSurface: "#111827",
  textMuted: "#4b5563",
  primary: "#3A78C2",
  primaryStrong: "#2f78cc",
  border: "#ffffff",
  accent: "#F4DC2E",
  shadow: "rgba(0, 0, 0, 0.16)",
};

const darkColors = {
  background: "#05050B",
  surface: "#111827",
  surfaceAlt: "#1f2937",
  text: "#f8fafc",
  textOnSurface: "#f8fafc",
  textMuted: "#cbd5e1",
  primary: "#8dc5ff",
  primaryStrong: "#0f172a",
  border: "#e2e8f0",
  accent: "#f4dc2e",
  shadow: "rgba(0, 0, 0, 0.45)",
};

const fontScaleMap: Record<FontSizeMode, number> = {
  small: 0.9,
  medium: 1,
  large: 1.16,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [fontSizeMode, setFontSizeModeState] = useState<FontSizeMode>("medium");

  const value = useMemo(() => ({
    theme,
    fontSizeMode,
    fontScale: fontScaleMap[fontSizeMode],
    toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
    setThemeMode: setTheme,
    setFontSizeMode: setFontSizeModeState,
    colors: theme === "light" ? lightColors : darkColors,
  }), [fontSizeMode, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

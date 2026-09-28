import api from "./api";
import i18n, { languageOptions } from "../i18n";

export const DEFAULT_ACCESSIBILITY_SETTINGS = {
    language: "es",
    textSize: "medium",
    theme: "light",
};

export function normalizeAccessibilitySettings(settings = {}) {
    return {
        language: languageOptions.some(({ code }) => code === settings.language)
            ? settings.language : DEFAULT_ACCESSIBILITY_SETTINGS.language,
        textSize: ["small", "medium", "large"].includes(settings.textSize)
            ? settings.textSize : DEFAULT_ACCESSIBILITY_SETTINGS.textSize,
        theme: ["light", "dark"].includes(settings.theme)
            ? settings.theme : DEFAULT_ACCESSIBILITY_SETTINGS.theme,
    };
}

export async function getAccessibilitySettings() {
    const response = await api.get("/api/accessibility-settings");
    return normalizeAccessibilitySettings(response.data);
}

export async function updateAccessibilitySettings(settings) {
    const response = await api.put("/api/accessibility-settings", settings);
    return normalizeAccessibilitySettings(response.data);
}

export function applyAccessibilitySettings(settings) {
    const normalized = normalizeAccessibilitySettings(settings);
    localStorage.setItem("language", normalized.language);
    localStorage.setItem("fontSize", normalized.textSize);
    localStorage.setItem("theme", normalized.theme);
    i18n.changeLanguage(normalized.language);
    document.documentElement.dataset.theme = normalized.theme;
    document.documentElement.style.colorScheme = normalized.theme;
    document.body.style.zoom = String({ small: 0.92, medium: 1, large: 1.08 }[normalized.textSize]);
    document.documentElement.dataset.textSize = normalized.textSize;
    return normalized;
}

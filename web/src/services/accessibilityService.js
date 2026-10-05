import api from "./api";
import i18n from "../i18n";
import {
    DEFAULT_ACCESSIBILITY_SETTINGS,
    normalizeStoredAccessibility,
    persistStoredAccessibility,
    readStoredAccessibility,
} from "./accessibilityStorage";

export function normalizeAccessibilitySettings(settings = {}) {
    return normalizeStoredAccessibility(settings);
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
    persistStoredAccessibility(normalized);
    i18n.changeLanguage(normalized.language);
    document.documentElement.dataset.theme = normalized.theme;
    document.documentElement.style.colorScheme = normalized.theme;
    document.body.style.zoom = String({ small: 0.92, medium: 1, large: 1.08 }[normalized.textSize]);
    document.documentElement.dataset.textSize = normalized.textSize;
    return normalized;
}

export { DEFAULT_ACCESSIBILITY_SETTINGS, readStoredAccessibility };

export const DEFAULT_ACCESSIBILITY_SETTINGS = {
    language: "es",
    textSize: "medium",
    theme: "light",
};

const ANONYMOUS_KEY = "accessibility.anonymous";
const ACCOUNT_PREFIX = "accessibility.user.";

export function normalizeStoredAccessibility(settings = {}) {
    return {
        language: ["es", "en", "pt", "it"].includes(settings.language)
            ? settings.language : DEFAULT_ACCESSIBILITY_SETTINGS.language,
        textSize: ["small", "medium", "large"].includes(settings.textSize)
            ? settings.textSize : DEFAULT_ACCESSIBILITY_SETTINGS.textSize,
        theme: ["light", "dark"].includes(settings.theme)
            ? settings.theme : DEFAULT_ACCESSIBILITY_SETTINGS.theme,
    };
}

export function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

function getUserIdentifier(user) {
    return user?.idUser || user?.id || user?.email || null;
}

function getStorageKey(user) {
    const identifier = getUserIdentifier(user);
    return identifier ? `${ACCOUNT_PREFIX}${identifier}` : ANONYMOUS_KEY;
}

function readJson(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
        return null;
    }
}

export function readStoredAccessibility(user = getStoredUser()) {
    const stored = readJson(getStorageKey(user));
    if (stored) return normalizeStoredAccessibility(stored);

    if (!user) {
        const legacy = {
            language: localStorage.getItem("language"),
            textSize: localStorage.getItem("fontSize"),
            theme: localStorage.getItem("theme"),
        };
        if (legacy.language || legacy.textSize || legacy.theme) return normalizeStoredAccessibility(legacy);
    }

    return { ...DEFAULT_ACCESSIBILITY_SETTINGS };
}

export function persistStoredAccessibility(settings, user = getStoredUser()) {
    const normalized = normalizeStoredAccessibility(settings);
    localStorage.setItem(getStorageKey(user), JSON.stringify(normalized));
    localStorage.setItem("language", normalized.language);
    localStorage.setItem("fontSize", normalized.textSize);
    localStorage.setItem("theme", normalized.theme);
    return normalized;
}

export function resetActiveViewToAnonymous() {
    const anonymous = readStoredAccessibility(null);
    localStorage.setItem("language", anonymous.language);
    localStorage.setItem("fontSize", anonymous.textSize);
    localStorage.setItem("theme", anonymous.theme);
    return anonymous;
}

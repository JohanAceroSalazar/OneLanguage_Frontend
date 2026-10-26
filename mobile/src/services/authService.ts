import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/network";

export type AccessibilitySettings = {
    language: "es" | "en" | "pt" | "it";
    textSize: "small" | "medium" | "large";
    theme: "light" | "dark";
};

const defaultAccessibilitySettings: AccessibilitySettings = {
    language: "es",
    textSize: "medium",
    theme: "light",
};

const anonymousAccessibilityKey = "accessibility.anonymous";
const accountAccessibilityPrefix = "accessibility.user.";

const normalizeAccessibilitySettings = (settings: Partial<AccessibilitySettings>): AccessibilitySettings => ({
    language: ["es", "en", "pt", "it"].includes(settings.language || "")
        ? settings.language as AccessibilitySettings["language"] : defaultAccessibilitySettings.language,
    textSize: ["small", "medium", "large"].includes(settings.textSize || "")
        ? settings.textSize as AccessibilitySettings["textSize"] : defaultAccessibilitySettings.textSize,
    theme: ["light", "dark"].includes(settings.theme || "")
        ? settings.theme as AccessibilitySettings["theme"] : defaultAccessibilitySettings.theme,
});

const getStoredUser = async () => {
    try {
        return JSON.parse(await AsyncStorage.getItem("user") || "null");
    } catch {
        return null;
    }
};

const getAccessibilityKey = (user: any) => {
    const identifier = user?.idUser || user?.id || user?.email;
    return identifier ? `${accountAccessibilityPrefix}${identifier}` : anonymousAccessibilityKey;
};

export const getLocalAccessibilitySettings = async (): Promise<AccessibilitySettings> => {
    const user = await getStoredUser();
    const stored = await AsyncStorage.getItem(getAccessibilityKey(user));
    if (stored) {
        try {
            return normalizeAccessibilitySettings(JSON.parse(stored));
        } catch {
            return { ...defaultAccessibilitySettings };
        }
    }

    if (!user) {
        return normalizeAccessibilitySettings({
            language: await AsyncStorage.getItem("language") as AccessibilitySettings["language"],
            textSize: await AsyncStorage.getItem("fontSize") as AccessibilitySettings["textSize"],
            theme: await AsyncStorage.getItem("theme") as AccessibilitySettings["theme"],
        });
    }

    return { ...defaultAccessibilitySettings };
};

export const hasLocalAccessibilitySettings = async () => {
    const user = await getStoredUser();
    return Boolean(await AsyncStorage.getItem(getAccessibilityKey(user)));
};

export const persistLocalAccessibilitySettings = async (settings: Partial<AccessibilitySettings>) => {
    const current = await getLocalAccessibilitySettings();
    const normalized = normalizeAccessibilitySettings({ ...current, ...settings });
    const user = await getStoredUser();
    await AsyncStorage.setItem(getAccessibilityKey(user), JSON.stringify(normalized));
    await AsyncStorage.multiSet([
        ["language", normalized.language],
        ["fontSize", normalized.textSize],
        ["theme", normalized.theme],
    ]);
    return normalized;
};

export const resetToAnonymousAccessibility = async () => {
    const stored = await AsyncStorage.getItem(anonymousAccessibilityKey);
    let settings = defaultAccessibilitySettings;
    if (stored) {
        try {
            settings = normalizeAccessibilitySettings(JSON.parse(stored));
        } catch {
            settings = defaultAccessibilitySettings;
        }
    }
    await AsyncStorage.multiSet([
        ["language", settings.language],
        ["fontSize", settings.textSize],
        ["theme", settings.theme],
    ]);
    return settings;
};

const readBody = async (response: Response) => {
    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};

const readError = async (response: Response, fallback: string) => {
    const errorBody = await readBody(response);
    throw errorBody?.message ? errorBody : { message: fallback };
};

export const clearAuthSession = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    await resetToAnonymousAccessibility();
};

export const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fullName: data.name,
            email: data.email,
            password: data.password,
        }),
    });

    if (!response.ok) {
        await readError(response, "Error del servidor");
    }

    return readBody(response);
};

export const loginUser = async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password,
        }),
    });

    if (!response.ok) {
        await readError(response, "Credenciales incorrectas");
    }

    return readBody(response);
};

const authenticatedRequest = async (path: string, options: RequestInit = {}) => {
    const token = await AsyncStorage.getItem("token");
    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });
};

export const getCurrentUser = async () => {
    const response = await authenticatedRequest("/api/users/me");

    if (response.status === 401) {
        await clearAuthSession();
        const error = new Error("La sesión no es válida.") as Error & { status?: number };
        error.status = 401;
        throw error;
    }

    if (!response.ok) await readError(response, "No se pudo cargar el perfil.");

    const user = await readBody(response);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    return user;
};

export const getAccessibilitySettings = async (): Promise<AccessibilitySettings> => {
    const response = await authenticatedRequest("/api/accessibility-settings");
    if (!response.ok) await readError(response, "No se pudieron cargar los ajustes de accesibilidad.");
    return normalizeAccessibilitySettings(await readBody(response));
};

export const updateAccessibilitySettings = async (settings: AccessibilitySettings) => {
    const response = await authenticatedRequest("/api/accessibility-settings", {
        method: "PUT",
        body: JSON.stringify(settings),
    });
    if (!response.ok) await readError(response, "No se pudieron guardar los ajustes de accesibilidad.");
    return normalizeAccessibilitySettings(await readBody(response));
};

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        await readError(response, "No se pudo enviar el enlace de recuperacion.");
    }

    return readBody(response);
};

export const resetPassword = async (
    tokenIdentifier: string,
    token: string,
    newPassword: string,
    confirmPassword: string
) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tokenIdentifier,
            token,
            newPassword,
            confirmPassword,
        }),
    });

    if (!response.ok) {
        await readError(response, "No se pudo restablecer la contrasena.");
    }

    return readBody(response);
};

import api from "./api";
import { applyAccessibilitySettings, getAccessibilitySettings } from "./accessibilityService";

export const registerUser = async (data) => {
    try {
        const payload = {
            fullName: data.name,
            email: data.email,
            password: data.password,
        };

        const response = await api.post("/api/users", payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error del servidor" };
    }
};

export const loginUser = async (data) => {
    try {
        const response = await api.post("/auth/login", {
            email: data.email,
            password: data.password,
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error del servidor" };
    }
};

export const syncAccessibilityAfterLogin = async () => {
    try {
        const settings = await getAccessibilitySettings();
        applyAccessibilitySettings(settings);
        return settings;
    } catch {
        return null;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await api.post("/auth/forgot-password", {
            email,
        });

        return response.data;
    } catch (error) {
        const responseData = error.response?.data;
        const message =
            responseData?.message ||
            responseData?.detail ||
            "No se pudo enviar el enlace de recuperación.";

        throw new Error(message);
    }
};

export const resetPassword = async (
    tokenIdentifier,
    token,
    newPassword,
    confirmPassword
) => {

    try{
    const response = await api.post("/auth/reset-password", {
        tokenIdentifier,
        token,
        newPassword,
        confirmPassword,
        });

    return response.data;
        } catch (error) {
            throw error.response?.data || {
        message: "No se pudo restablecer la contraseña.",
        };
    }
};

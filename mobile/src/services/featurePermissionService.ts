import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/network";

export type FeaturePermission = "camera" | "audio" | "files";

export type FeaturePermissions = Record<FeaturePermission, boolean>;

const defaultPermissions: FeaturePermissions = {
    camera: false,
    audio: false,
    files: false,
};

const request = async (options: RequestInit = {}) => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/feature-permissions`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        throw new Error((await response.text()) || "No se pudieron actualizar los permisos.");
    }
    return response.json();
};

const normalizePermissions = (data: Partial<FeaturePermissions>): FeaturePermissions => ({
    ...defaultPermissions,
    ...data,
});

export const getFeaturePermissions = async (): Promise<FeaturePermissions> =>
    normalizePermissions(await request());

export const setFeaturePermission = async (feature: FeaturePermission, enabled: boolean): Promise<FeaturePermissions> =>
    normalizePermissions(await request({
        method: "PUT",
        body: JSON.stringify({ feature, enabled }),
    }));

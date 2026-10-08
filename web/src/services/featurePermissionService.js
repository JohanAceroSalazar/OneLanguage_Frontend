import api from "./api";

const defaultPermissions = {
    camera: false,
    audio: false,
    files: false,
};

function normalizePermissions(data) {
    return { ...defaultPermissions, ...data };
}

export async function getFeaturePermissions() {
    const response = await api.get("/api/feature-permissions");
    return normalizePermissions(response.data);
}

export async function setFeaturePermission(feature, enabled) {
    const response = await api.put("/api/feature-permissions", { feature, enabled });
    return normalizePermissions(response.data);
}

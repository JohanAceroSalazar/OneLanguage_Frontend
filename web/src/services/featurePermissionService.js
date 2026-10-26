import api from "./api";

const defaultPermissions = {
    camera: false,
    audio: false,
};

function normalizePermissions(data) {
    return {
        camera: Boolean(data?.camera ?? defaultPermissions.camera),
        audio: Boolean(data?.audio ?? defaultPermissions.audio),
    };
}

export async function getFeaturePermissions() {
    const response = await api.get("/api/feature-permissions");
    return normalizePermissions(response.data);
}

export async function setFeaturePermission(feature, enabled) {
    const response = await api.put("/api/feature-permissions", { feature, enabled });
    return normalizePermissions(response.data);
}

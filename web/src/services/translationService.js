import api from "./api";

export async function saveTranslation({ translatedText, confidence }) {
    const response = await api.post("/api/translations", { translatedText, confidence });
    return response.data;
}

export async function getTranslations() {
    const response = await api.get("/api/translations");
    return response.data;
}

export async function deleteTranslation(id) {
    await api.delete(`/api/translations/${id}`);
}

export async function deleteAllTranslations() {
    await api.delete("/api/translations");
}

import api from "./api";

export async function saveTranslation({ translatedText, confidence, recording }) {
    if (recording) {
        const formData = new FormData();
        formData.append("translatedText", translatedText);
        if (confidence !== null && confidence !== undefined) formData.append("confidence", String(confidence));
        formData.append("recording", recording, "translation-recording.webm");
        const response = await api.post("/api/translations/with-recording", formData, {
            headers: { "Content-Type": undefined },
        });
        return response.data;
    }
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

export async function getTranslationRecording(id) {
    const response = await api.get(`/api/translations/${id}/recording`, { responseType: "blob" });
    return response.data;
}

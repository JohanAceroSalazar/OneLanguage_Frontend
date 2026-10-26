import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/network";

export type Translation = {
  id: string;
  translatedText: string;
  confidence: number | null;
  hasRecording: boolean;
  createdAt: string;
};

type TranslationInput = {
  translatedText: string;
  confidence: number | null;
  recording?: { uri: string; type: "video/mp4"; name: string } | null;
};

const request = async (path = "", options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem("token");
  const isMultipart = typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/api/translations${path}`, {
    ...options,
    headers: {
      ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No se pudo completar la solicitud de traducciones.");
  }

  if (response.status === 204) return null;
  return response.json();
};

export const saveTranslation = (input: TranslationInput): Promise<Translation> => {
  if (!input.recording) {
    return request("", {
      method: "POST",
      body: JSON.stringify({ translatedText: input.translatedText, confidence: input.confidence }),
    });
  }

  const formData = new FormData();
  formData.append("translatedText", input.translatedText);
  if (input.confidence !== null) formData.append("confidence", String(input.confidence));
  formData.append("recording", input.recording as never);
  return request("/with-recording", { method: "POST", body: formData });
};

export const getTranslations = (): Promise<Translation[]> => request();

export const deleteTranslation = (id: string) =>
  request(`/${id}`, { method: "DELETE" });

export const deleteAllTranslations = () =>
  request("", { method: "DELETE" });

export const getTranslationRecordingUrl = (id: string) =>
  `${API_BASE_URL}/api/translations/${id}/recording`;


import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/network";

export type Translation = {
  id: string;
  translatedText: string;
  confidence: number | null;
  createdAt: string;
};

type TranslationInput = {
  translatedText: string;
  confidence: number | null;
};

const request = async (path = "", options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/translations${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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

export const saveTranslation = (input: TranslationInput): Promise<Translation> =>
  request("", { method: "POST", body: JSON.stringify(input) });

export const getTranslations = (): Promise<Translation[]> => request();

export const deleteTranslation = (id: string) =>
  request(`/${id}`, { method: "DELETE" });

export const deleteAllTranslations = () =>
  request("", { method: "DELETE" });


import Constants from "expo-constants";

const DEFAULT_API_PORT = "8084";
const DEFAULT_AI_PORT = "8001";
const LOCALHOST = "127.0.0.1";
const PRODUCTION_API_URL = "https://onelanguage.tech";
const PRODUCTION_AI_URL = "wss://ai.onelanguage.tech/ws/recognize";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const isPublicSecureUrl = (value: string | undefined, protocol: "https:" | "wss:") => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === protocol && !/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.0\.0\.0$)/i.test(url.hostname);
  } catch {
    return false;
  }
};

const getDevelopmentHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) return LOCALHOST;

  const normalized = hostUri.replace(/^https?:\/\//, "");
  if (normalized.startsWith("[")) {
    return normalized.slice(1, normalized.indexOf("]"));
  }

  return normalized.split(":")[0] || LOCALHOST;
};

const developmentHost = getDevelopmentHost();

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const configuredAiUrl = process.env.EXPO_PUBLIC_AI_WS_URL?.trim();

export const API_BASE_URL = trimTrailingSlash(
  __DEV__
    ? configuredApiUrl || `http://${developmentHost}:${DEFAULT_API_PORT}`
    : isPublicSecureUrl(configuredApiUrl, "https:") ? configuredApiUrl! : PRODUCTION_API_URL,
);

export const AI_WEBSOCKET_URL =
  __DEV__
    ? configuredAiUrl || `ws://${developmentHost}:${DEFAULT_AI_PORT}/ws/recognize`
    : isPublicSecureUrl(configuredAiUrl, "wss:") ? configuredAiUrl! : PRODUCTION_AI_URL;


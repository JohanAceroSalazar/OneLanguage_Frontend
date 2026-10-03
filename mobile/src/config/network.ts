import Constants from "expo-constants";

const DEFAULT_API_PORT = "8084";
const DEFAULT_AI_PORT = "8000";
const LOCALHOST = "127.0.0.1";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

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

export const API_BASE_URL = trimTrailingSlash(
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
    `http://${developmentHost}:${DEFAULT_API_PORT}`,
);

export const AI_WEBSOCKET_URL =
  process.env.EXPO_PUBLIC_AI_WS_URL?.trim() ||
  `ws://${developmentHost}:${DEFAULT_AI_PORT}/ws/recognize`;


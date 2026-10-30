export function resolveAiSocketUrl(configuredUrl, location) {
    const normalizedUrl = configuredUrl?.trim();
    if (normalizedUrl) return normalizedUrl;

    const protocol = location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${location.host}/ws/recognize`;
}

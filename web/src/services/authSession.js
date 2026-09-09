const TOKEN_KEY = "token";
const USER_KEY = "user";

function getTokenExpiration(token) {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decodedPayload).exp;
    } catch {
        return null;
    }
}

export function clearAuthSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getValidToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const expiration = getTokenExpiration(token);
    if (!expiration || expiration * 1000 <= Date.now()) {
        clearAuthSession();
        return null;
    }

    return token;
}

export function hasValidSession() {
    return Boolean(getValidToken());
}

export function endSessionAndRedirectToLogin() {
    clearAuthSession();

    if (window.location.pathname !== "/login") {
        window.location.replace("/login");
    }
}

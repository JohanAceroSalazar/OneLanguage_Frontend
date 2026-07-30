import Constants from "expo-constants";

const API_PORT = "8084";
const FALLBACK_API_HOST = "10.3.234.244";

const getApiUrl = () => {
    const hostUri =
        Constants.expoConfig?.hostUri ||
        Constants.manifest2?.extra?.expoClient?.hostUri;

    const host = hostUri?.split(":")[0] || FALLBACK_API_HOST;

    return `http://${host}:${API_PORT}`;
};

const API_URL = getApiUrl();

const readBody = async (response: Response) => {
    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};

const readError = async (response: Response, fallback: string) => {
    const errorBody = await readBody(response);
    throw errorBody?.message ? errorBody : { message: fallback };
};

export const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fullName: data.name,
            email: data.email,
            password: data.password,
        }),
    });

    if (!response.ok) {
        await readError(response, "Error del servidor");
    }

    return readBody(response);
};

export const loginUser = async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password,
        }),
    });

    if (!response.ok) {
        await readError(response, "Credenciales incorrectas");
    }

    return readBody(response);
};

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        await readError(response, "No se pudo enviar el enlace de recuperacion.");
    }

    return readBody(response);
};

export const resetPassword = async (
    tokenIdentifier: string,
    token: string,
    newPassword: string,
    confirmPassword: string
) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tokenIdentifier,
            token,
            newPassword,
            confirmPassword,
        }),
    });

    if (!response.ok) {
        await readError(response, "No se pudo restablecer la contrasena.");
    }

    return readBody(response);
};

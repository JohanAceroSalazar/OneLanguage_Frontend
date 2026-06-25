const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8084";

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
            passwordHash: data.password,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw errorBody ?? { message: "Error del servidor" };
    }

    return response.json();
};

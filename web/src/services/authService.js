import api from "./api";

export const registerUser = async (data) => {
    try {
        const payload = {
            fullName: data.name,
            email: data.email,
            password: data.password,
        };

        const response = await api.post("/api/users", payload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error del servidor" };
    }
};

export const loginUser = async (data) => {
    try {
        const response = await api.post("/auth/login", {
            email: data.email,
            password: data.password,
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error del servidor" };
    }
};
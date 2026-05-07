import api from "./api";

export const registerUser = async (data) => {
    try {
        const response = await api.post("/auth/register", data);
            return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error del servidor" };
    }
};
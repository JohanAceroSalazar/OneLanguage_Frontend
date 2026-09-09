import axios from 'axios';
import { endSessionAndRedirectToLogin, getValidToken } from "./authSession";

const publicAuthenticationEndpoints = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/users",
];

const isPublicAuthenticationRequest = (url = "") =>
  publicAuthenticationEndpoints.some((endpoint) => url.endsWith(endpoint));

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT en las peticiones que lo requieran
api.interceptors.request.use(
  (config) => {
    const token = getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !isPublicAuthenticationRequest(error.config?.url)
    ) {
      endSessionAndRedirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default api;

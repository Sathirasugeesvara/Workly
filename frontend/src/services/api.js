import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Automatically attach JWT Token
 */
api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },

    (error) => Promise.reject(error)

);

/**
 * Handle expired token
 */
api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            // Save message for Login page
            sessionStorage.setItem(
                "sessionExpired",
                "Your session has expired. Please sign in again."
            );

            window.location.href = "/login";

        }

        return Promise.reject(error);

    }

);

export default api;
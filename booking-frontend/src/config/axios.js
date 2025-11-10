// src/config/axios.js
import axios from "axios";
import API_BASE_URL from "./api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Attach token automatically before each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or "access_token" depending on your backend
    if (token) {
      config.headers.Authorization =` Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠ Handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("⚠ Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error(" Server error:", error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",   // MUST be a plain string
  withCredentials: true,                  // login, cookies etc
  timeout: 20000,                         // 20 sec timeout (safe)
});

// 🔹 Automatically attach auth token (if exists)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Auto-handle expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
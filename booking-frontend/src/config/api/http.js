import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000",
});

// If you store token in localStorage: "token"
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
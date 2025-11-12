import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "", // same-origin by default
});

http.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("API error:", e?.response?.data || e.message);
    throw e;
  }
);

export default http;
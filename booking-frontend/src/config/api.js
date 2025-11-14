// src/api/api.js

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Safety fallback (should never be triggered in production)
if (!API_BASE_URL) {
  API_BASE_URL = "https://easy-stay.onrender.com";
}

export default API_BASE_URL;
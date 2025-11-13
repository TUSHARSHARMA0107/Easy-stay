//choose backend url accordingly
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Detect environment
if (window.location.hostname === "localhost") {
  API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
} 
else if (window.location.hostname.includes("staging")) {
  API_BASE_URL = "https://staging.yourapp.com/api";
} 
else {
  API_BASE_URL = "https://yourapp.vercel.app/api";
}

export default API_BASE_URL;
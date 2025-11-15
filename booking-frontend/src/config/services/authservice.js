import http from "../api/http";

// Register new user or owner
export const register = async (data) => {
  try {
    const res = await http.post("/api/auth/register", data);
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
};

// Login user
export const login = async (data) => {
  try {
    const res = await http.post("/api/auth/login", data);
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// Return authenticated user
export const getProfile = async () => {
  try {
    const res = await http.get("/api/auth/me");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch profile" };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
};
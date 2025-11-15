import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  // User login function
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    setUser(res.data.user);

    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  };

  // Google login
  const googleLogin = async (googleToken) => {
    const res = await api.post("/auth/google-login", { googleToken });

    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    setUser(res.data.user);

    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
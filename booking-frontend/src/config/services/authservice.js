import api from "../config/axios";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const verifyEmail = async (token) => {
  const res = await api.get(`/auth/verify/${token}`);
  return res.data;
};

export const getUserProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};
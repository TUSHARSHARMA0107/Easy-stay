import api from "../config/axios";

export const createBusiness = async (data) => {
  const res = await api.post("/business", data);
  return res.data;
};

export const getBusinesses = async (params) => {
  const res = await api.get("/business", { params });
  return res.data;
};

export const getBusinessById = async (id) => {
  const res = await api.get(`/business/${id}`);
  return res.data;
};

export const uploadBusinessImage = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/business/${id}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
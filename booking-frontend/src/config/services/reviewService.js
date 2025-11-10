import api from "../config/axios";

export const addReview = async (data) => {
  const res = await api.post("/reviews", data);
  return res.data;
};

export const getReviews = async (businessId) => {
  const res = await api.get(`/reviews/${businessId}`);
  return res.data;
};
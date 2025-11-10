import api from "../config/axios";

export const initiatePayment = async (data) => {
  const res = await api.post("/payment/initiate", data);
  return res.data;
};

export const confirmPayment = async (paymentId) => {
  const res = await api.post(`/payment/confirm/${paymentId}`);
  return res.data;
};
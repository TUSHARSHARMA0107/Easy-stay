import api from "../config/axios";

export const createBooking = async (data) => {
  const res = await api.post("/booking", data);
  return res.data;
};

export const getBookings = async () => {
  const res = await api.get("/booking");
  return res.data;
};

export const getBookingById = async (id) => {
  const res = await api.get(`/booking/${id}`);
  return res.data;
};
import http from "../api/http";

export const createBooking = (payload) =>
  http.post("/api/bookings", payload).then((r) => r.data);

export const getMyBookings = () =>
  http.get("/api/bookings/me").then((r) => r.data);
import http from "../api/http";

// Start Razorpay checkout
export const createOrder = async (bookingData) => {
  try {
    const res = await http.post("/api/bookings", bookingData); 
    return res.data; // contains razorpay order + bookingId
  } catch (err) {
    throw err.response?.data || { message: "Payment initiation failed" };
  }
};

// Verify payment after Razorpay callback
export const verifyPayment = async (payload) => {
  try {
    const res = await http.post("/api/payment/verify", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Payment verification failed" };
  }
};

// Get invoice
export const getInvoice = async (bookingId) => {
  try {
    const res = await http.get(`/api/invoice/${bookingId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Invoice fetch failed" };
  }
};
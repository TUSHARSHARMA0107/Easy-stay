import http from "../api/http";

// Create new business
export const createBusiness = async (data) => {
  try {
    const res = await http.post("/api/business/create", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Business creation failed" };
  }
};

// Update a business
export const updateBusiness = async (id, data) => {
  try {
    const res = await http.put(`/api/business/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Business update failed" };
  }
};

// Get business by ID
export const getBusiness = async (id) => {
  try {
    const res = await http.get(`/api/business/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to get business" };
  }
};

// Get businesses of owner
export const getOwnerBusinesses = async () => {
  try {
    const res = await http.get("/api/business/owner/me");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to load businesses" };
  }
};
// utils/apiClient.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * 🔑 RapidAPI Key (GLOBAL)
 */
const RAPID_API_KEY = process.env.RAPID_API_KEY;

/**
 * 🌐 Axios instance for normal API calls
 */
export const apiClient = axios.create({
  baseURL: process.env.BASE_API_URL || "", // optional, adjust if needed
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🚀 Unified RapidAPI Request helper
 * Used by all providers (Booking, Agoda, TripAdvisor, Airbnb, Hotels.com)
 */
export async function rapidRequest({ host, url, method = "GET", params = {}, data = {} }) {
  try {
    const response = await axios({
      method,
      url,
      params,
      data,
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": RAPID_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("RapidAPI error (${host}):, err.response?.data || err.message");
    return null;
  }
}
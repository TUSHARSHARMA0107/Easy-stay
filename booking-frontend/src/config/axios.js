// config/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // yahi hona chahiye
  withCredentials: true,
});

export default api;
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const apiClient = async (host, url, method = "GET", data = null, params = null) => {
  try {
    const options = {
      method,
      url,
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": host,
        "Content-Type": "application/json",
      },
      data,
      params,
    };

    const res = await axios(options);
    return res.data;
  } catch (err) {
    console.error( `Error fetching from ${host}:, err.response?.data || err.message`);
    return null;
  }
};

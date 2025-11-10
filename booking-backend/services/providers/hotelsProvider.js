import { apiClient } from "../../utils/apiClient.js";
import dotenv from "dotenv";
dotenv.config();

export const getHotelsComPrices = async (query = "New York") => {
  const host = process.env.RAPIDAPI_HOST_HOTELS;
  const url = `https://${host}/v2/regions`;
  const params = { query, domain: "US", locale: "en_US" };

  const data = await apiClient(host, url, "GET", null, params);
  if (!data) return [];

  return (data?.data || []).map((item) => ({
    platform: "Hotels.com",
    name: item.regionNames?.fullName || query,
    price: item.price?.current || null,
    link: item.url || null,
  }));
};
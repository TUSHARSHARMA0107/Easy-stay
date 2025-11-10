import { apiClient } from "../../utils/apiClient.js";
import dotenv from "dotenv";
dotenv.config();

export const getAirbnbPrices = async (placeId = "ChIJ7cv00DwsDogRAMDACa2m4K8") => {
  const host = process.env.RAPIDAPI_HOST_AIRBNB;
  const url = `https://${host}/api/v2/searchPropertyByPlaceId`;
  const params = { placeId, adults: 1, currency: "USD" };

  const data = await apiClient(host, url, "GET", null, params);
  if (!data) return [];

  return (data?.data || []).map((p) => ({
    platform: "Airbnb",
    name: p.name,
    price: p.price?.total || null,
    link: p.url || null,
  }));
};
import { apiClient } from "../../utils/apiClient.js";
import dotenv from "dotenv";
dotenv.config();

export const getAgodaPrices = async (locationId = "1_318") => {
  const host = process.env.RAPIDAPI_HOST_AGODA;
  const url = `https://${host}/hotels/search-overnight`;
  const params = { id: locationId };

  const data = await apiClient(host, url, "GET", null, params);
  if (!data) return [];

  return (data?.hotels || []).map((hotel) => ({
    platform: "Agoda",
    name: hotel.propertyName,
    price: hotel.price || null,
    link: hotel.propertyUrl || null,
  }));
};
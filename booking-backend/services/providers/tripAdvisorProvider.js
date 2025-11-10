import { apiClient } from "../../utils/apiClient.js";
import dotenv from "dotenv";
dotenv.config();

export const getTripAdvisorPrices = async (locationId = "304554") => {
  const host = process.env.RAPIDAPI_HOST_TRIPADVISOR;
  const url = `https://${host}/api/v1/hotels/getHotelDetails`;
  const params = { locationId, currency: "USD" };

  const data = await apiClient(host, url, "GET", null, params);
  if (!data) return [];

  const hotel = data?.data?.hotel;
  return hotel
    ? [
        {
          platform: "TripAdvisor",
          name: hotel.name,
          price: hotel.price?.display || null,
          link: hotel.webUrl || null,
        },
      ]
    : [];
};
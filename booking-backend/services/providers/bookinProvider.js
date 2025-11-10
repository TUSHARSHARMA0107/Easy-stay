import { apiClient } from "../../utils/apiClient.js";
import dotenv from "dotenv";
dotenv.config();

export const getBookingPrices = async (city) => {
  const host = process.env.RAPIDAPI_HOST_BOOKING;
  const url = `https://${host}/list-hotels/`;
  const params = { city_name: city, page_number: 1, items_per_page: 25 };

  const data = await apiClient(host, url, "GET", null, params);
  if (!data) return [];

  return (data?.data || []).map((hotel) => ({
    platform: "Booking.com",
    name: hotel.name,
    price: hotel.price || null,
    link: hotel.url || hotel.booking_url || null,
  }));
};
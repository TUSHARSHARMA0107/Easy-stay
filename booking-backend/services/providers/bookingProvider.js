// src/services/providers/bookingProvider.js
import { rapidRequest } from "../../utils/apiClient.js";

const HOST = process.env.RAPIDAPI_HOST_BOOKING; // booking-com-api4.p.rapidapi.com

/**
 * Fetch hotel prices from Booking.com RapidAPI provider
 * 
 * @param {string} name - Hotel or property name
 * @param {string} location - City or area name
 * @returns {Promise<Array>} Formatted hotel results for comparison
 */
export async function getBookingPrices(name = "", location = "") {
  try {
    // Use either name or location to query
    const city = encodeURIComponent(location || name || "India");
    const url = "https://${HOST}/list-hotels/";

    const params = {
      city_name: city,
      page_number: 1,
      items_per_page: 10,
    };

    const data = await rapidRequest({ host: HOST, url, params });

    // The structure of RapidAPI response varies, but typically:
    const hotels = data?.data || data?.hotels || [];

    return hotels.map((h) => ({
      platform: "booking.com",
      name: h.hotel_name || h.name || "Unknown",
      price: Number(h.min_total_price || h.price || 0),
      currency: h.currency || "USD",
      link:
        h.url ||
        h.booking_url ||
        (h.hotel_id
          ? "https://www.booking.com/hotel/${h.hotel_id}.html"
          : null),
      raw: h,
    }));
  } catch (error) {
    console.error("BookingProvider Error:", error.message);
    return [];
  }
}






































































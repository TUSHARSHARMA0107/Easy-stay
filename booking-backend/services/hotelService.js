import axios from "axios";

const hotelAPI = axios.create({
  baseURL: "https://booking-com18.p.rapidapi.com",
  headers: {
    "x-rapidapi-host": "booking-com18.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPID_KEY,
  },
});

// ---------- AUTO COMPLETE ----------
export async function autoHotelSearch(query) {
  try {
    const r = await hotelAPI.get("/stays/auto-complete", {
      params: { query },
    });

    return r.data?.data || [];
  } catch (err) {
    console.log("autoHotelSearch ERROR:", err.response?.data);
    return [];
  }
}

// ---------- SEARCH HOTELS ----------
export async function searchHotels(city) {
  try {
    const auto = await autoHotelSearch(city);
    const loc = auto?.[0];

    if (!loc?.location_id) return [];

    const r = await hotelAPI.get("/stays/search", {
      params: {
        locationId: loc.location_id,
        units: "metric",
        temperature: "c",
      },
    });

    const hotels = r.data?.data?.hotels || [];

    return hotels.map((h) => ({
      id: h.hotel_id,
      name: h.hotel_name,
      city: h.city,
      country: h.country,
      rating: h.rating,
      reviewCount: h.review_count,
      price: h.price,
      currency: h.currency,
      photos: h.main_photo_url ? [h.main_photo_url] : [],
    }));
  } catch (err) {
    console.log("searchHotels ERROR:", err.response?.data);
    return [];
  }
}

// ---------- HOTEL DETAILS ----------
export async function getHotelDetail(hotelId) {
  try {
    const detail = await hotelAPI.get("/stays/detail", {
      params: { hotelId },
    });

    const photos = await hotelAPI.get("/stays/get-photos", {
      params: { hotelId },
    });

    const reviews = await hotelAPI.get("/stays/reviews", {
      params: { hotelId },
    });

    const desc = await hotelAPI.get("/stays/get-description", {
      params: { hotelId },
    });

    return {
      id: hotelId,
      name: detail.data?.data?.hotel_name,
      city: detail.data?.data?.city,
      country: detail.data?.data?.country,
      rating: detail.data?.data?.rating,
      reviewCount: detail.data?.data?.review_count,
      price: detail.data?.data?.price,
      currency: detail.data?.data?.currency,
      description: desc.data?.data?.description || "No description available",

      photos: photos.data?.data?.map((p) => p.url_max) || [],

      facilities: detail.data?.data?.facilities || [],

      reviews: reviews.data?.data || [],

      location: {
        address: detail.data?.data?.address || "",
        lat: detail.data?.data?.latitude,
        lng: detail.data?.data?.longitude,
      },
    };
  } catch (err) {
    console.log("getHotelDetail ERROR:", err.response?.data);
    return null;
  }
}
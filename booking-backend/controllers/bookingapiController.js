// controllers/bookingapiController.js
import axios from "axios";

const bookingClient = axios.create({
  baseURL: "https://booking-com18.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_BOOKING_KEY,
    "x-rapidapi-host": process.env.RAPIDAPI_BOOKING_HOST || "booking-com18.p.rapidapi.com",
  },
});

const imageClient = axios.create({
  baseURL: "https://google-search-master-mega.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_GOOGLEIMAGES_KEY,
    "x-rapidapi-host": process.env.RAPIDAPI_GOOGLEIMAGES_HOST || "google-search-master-mega.p.rapidapi.com",
  },
});

// Small helper
const safeJson = (res, status = 200) => (data) => res.status(status).json(data);

// -----------------------------
// 1) HOTEL AUTO-COMPLETE
// -----------------------------
export const autoCompleteHotels = async (req, res) => {
  try {
    const query = req.query.q || req.query.query || "Shimla";

    const { data } = await bookingClient.get("/stays/auto-complete", {
      params: { query },
    });

    safeJson(res)({ query, suggestions: data });
  } catch (err) {
    console.error("autoCompleteHotels error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch hotel suggestions" });
  }
};

// -----------------------------
// 2) SEARCH HOTELS BY locationId
//    (frontend ko locationId pass karna hoga)
// -----------------------------
export const searchHotels = async (req, res) => {
  try {
    const { locationId, units = "metric", temperature = "c" } = req.query;

    if (!locationId) {
      return res
        .status(400)
        .json({ message: "locationId is required for search" });
    }

    const { data } = await bookingClient.get("/stays/search", {
      params: { locationId, units, temperature },
    });

    safeJson(res)({ locationId, result: data });
  } catch (err) {
    console.error("searchHotels error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to search hotels" });
  }
};

// -----------------------------
// 3) HOTEL DETAIL / PHOTOS / DESCRIPTION / REVIEWS
// -----------------------------
export const getHotelDetail = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { units = "metric" } = req.query;

    const { data } = await bookingClient.get("/stays/detail", {
      params: { hotelId, units },
    });

    safeJson(res)({ hotelId, detail: data });
  } catch (err) {
    console.error("getHotelDetail error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch hotel detail" });
  }
};

export const getHotelPhotos = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const { data } = await bookingClient.get("/stays/get-photos", {
      params: { hotelId },
    });

    safeJson(res)({ hotelId, photos: data });
  } catch (err) {
    console.error("getHotelPhotos error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch hotel photos" });
  }
};

export const getHotelDescription = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const { data } = await bookingClient.get("/stays/get-description", {
      params: { hotelId },
    });

    safeJson(res)({ hotelId, description: data });
  } catch (err) {
    console.error("getHotelDescription error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch description" });
  }
};

export const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const { data } = await bookingClient.get("/stays/reviews", {
      params: { hotelId },
    });

    safeJson(res)({ hotelId, reviews: data });
  } catch (err) {
    console.error("getHotelReviews error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// -----------------------------
// 4) ATTRACTION IMAGES (Google)
// -----------------------------
export const getAttractionImages = async (req, res) => {
  try {
    // q = search term like "Shimla tourist places"
    const q =
      req.query.q || req.query.query || "Shimla tourist places";

    const { data } = await imageClient.get("/images", {
      params: {
        q,
        gl: "in",
        hl: "en",
        autocorrect: "true",
        num: 10,
        page: 1,
      },
    });

    // RapidAPI ka response bada hota hai, frontend ke liye simple bana dete
    const images =
      data?.images?.map((img) => ({
        url: img.image || img.thumbnail,
        source: img.source || img.domain,
        title: img.title,
      })) || [];

    safeJson(res)({ q, images });
  } catch (err) {
    console.error("getAttractionImages error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch attraction images" });
  }
};

// -----------------------------
// 5) HOME PAGE SECTIONS
//    default: Shimla, Goa, Assam
//    yahi use karega Homepage
// -----------------------------
export const getHomeSections = async (req, res) => {
  const cities = ["Shimla", "Goa", "Assam"];

  try {
    const results = await Promise.all(
      cities.map(async (city) => {
        // 5–6 attraction photos
        let attractions = [];
        try {
          const { data: imgData } = await imageClient.get("/images", {
            params: {
              q: `${city} tourist places`,
              gl: "in",
              hl: "en",
              autocorrect: "true",
              num: 8,
              page: 1,
            },
          });

          attractions =
            imgData?.images?.map((img) => ({
              url: img.image || img.thumbnail,
              title: img.title,
              source: img.source || img.domain,
            })) || [];
        } catch (err) {
          console.error(`Images error for ${city}:`, err.response?.data || err.message);
        }

        // hotel suggestions (auto-complete ko hi lightweight hotel list ki tarah use kar rahe)
        let hotelSuggestions = [];
        try {
          const { data: autoData } = await bookingClient.get(
            "/stays/auto-complete",
            { params: { query: city } }
          );

          // response ka shape fix nahi pata, isliye thoda defensive mapping
          const rawItems = Array.isArray(autoData) ? autoData : autoData?.data || autoData?.results || [];

          hotelSuggestions = rawItems.slice(0, 6).map((item, idx) => ({
            id: `item.hotel_id || item.id || auto-${city}-${idx}`,
            name: item.name || item.hotel_name || item.label || city,
            city: city,
            // thumbnail agar aaye to theek, nahin to null
            thumb:
              item.image_url ||
              item.thumbnail ||
              item.photo || 
              null,
            // yeh field frontend ko locationId pass karne me kaam aa sakta
            locationId: item.locationId || item.search_id || item.dest_id || null,
          }));
        } catch (err) {
          console.error(`Auto-complete error for ${city}:, err.response?.data || err.message`);
        }

        return {
          city,
          attractions,
          hotels: hotelSuggestions,
        };
      })
    );

    safeJson(res)({ sections: results });
  } catch (err) {
    console.error("getHomeSections error:", err.message);
    res.status(500).json({ message: "Failed to build home sections" });
  }
};
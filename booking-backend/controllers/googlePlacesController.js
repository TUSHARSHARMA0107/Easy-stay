import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const RAPID_API_KEY = process.env.RAPID_API_KEY;

export const searchPlaces = async (req, res) => {
  try {
    const { query, lat, lng, type, minRating, radius } = req.query;

    // 🧠 1️⃣ Default fallback if user gives nothing
    const finalQuery = query || type || "popular places";

    // 🧠 2️⃣ Default location (you can set to your city center)
    const centerLat = lat ? parseFloat(lat) : 28.6139; // New Delhi
    const centerLng = lng ? parseFloat(lng) : 77.2090;
    const searchRadius = radius ? parseInt(radius) : 10000; // 10km default

    const body = {
      textQuery: finalQuery,
      languageCode: "en",
      maxResultCount: 10,
      minRating: minRating ? parseFloat(minRating) : 0,
      includedType: type || "",
      strictTypeFiltering: !!type,
      locationBias: {
        circle: {
          center: { latitude: centerLat, longitude: centerLng },
          radius: searchRadius
        }
      }
    };

    const response = await axios.post(
      "https://google-map-places-new-v2.p.rapidapi.com/v1/places:searchText",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*",
          "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
          "x-rapidapi-key": RAPID_API_KEY
        }
      }
    );

    // 🧹 Format results a bit
    const places = response.data.places?.map(place => ({
      name: place.displayName?.text,
      address: place.formattedAddress,
      rating: place.rating,
      type: place.primaryTypeDisplayName?.text,
      photo: place.photos?.[0]?.name
        ? `https://google-map-places-new-v2.p.rapidapi.com/v1/${place.photos?.[0]?.name}/media?maxWidthPx=400&maxHeightPx=400&skipHttpRedirect=true`
        : null,
      link: place.googleMapsUri
    }));

    return res.json({ results: places || [] });
  } catch (err) {
    console.error("Error searching places:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch places" });
  }
};
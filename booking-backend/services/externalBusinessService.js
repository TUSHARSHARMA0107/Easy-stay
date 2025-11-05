// services/externalBusinessService.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_KEY;

// Fetch external business data from Geoapify
export const fetchExternalBusinesses = async (query, category) => {
  try {
    const url = `https://api.geoapify.com/v2/places?categories=${category || "accommodation.hotel, catering.restaurant"}&text=${encodeURIComponent(
      query
    )}&limit=10&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await axios.get(url);

    // Format data to match internal business model
        const businesses = response.data.features.map((place) => ({
          id: place.properties.place_id,
          name: place.properties.name || "Unnamed Place",
          address: place.properties.address_line2 || place.properties.formatted,
          location: [place.properties.city, place.properties.state].filter(Boolean).join(", "),
          latitude: place.geometry.coordinates[1],
          longitude: place.geometry.coordinates[0],
          type: category || "Unknown",
          rating: place.properties.rank || null,
          images: [
            // placeholder, will replace with Google photo later
            "https://via.placeholder.com/300x200?text=Image+Unavailable",
          ],
          source: "external",
        }));
    
        return businesses;
  } catch (error) {
    console.error("Geoapify API error:", error.message);
    return [];
  }
};
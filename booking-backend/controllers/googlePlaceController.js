// controllers/googlePlacesController.js
import { fetchGooglePlaces } from "../services/googlePlacesService.js";

export const getGooglePlaces = async (req, res) => {
  try {
    const { query, type } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = await fetchGooglePlaces(query, type);
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching Google Places:", error.message);
    res.status(500).json({ message: "Failed to fetch data from Google Places" });
  }
};
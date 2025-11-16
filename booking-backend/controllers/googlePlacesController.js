// controllers/googlePlacesController.js

import {
  searchPlacesService,
  getPlaceDetailsService,
  getPlacePhotoService,
} from "../services/googlePlacesService.js";

/**
 * 🔍 SEARCH CONTROLLER
 * /api/places/search?query=manali
 */
export const searchPlacesController = async (req, res) => {
  try {
    const {
      query,
      lat,
      lng,
      radius,
      type,
      minRating,
      maxResults,
      openNow,
    } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const response = await searchPlacesService({
      textQuery: query,
      latitude: lat ? parseFloat(lat) : undefined,
      longitude: lng ? parseFloat(lng) : undefined,
      radius: radius ? Number(radius) : 10000,
      type: type || "",
      minRating: minRating ? Number(minRating) : 0,
      maxResults: maxResults ? Number(maxResults) : 10,
      openNow: openNow === "true",
    });

    const places =
      response.places?.map((p) => ({
        placeId: p.id,
        name: p.displayName?.text,
        address: p.formattedAddress,
        rating: p.rating,
        type: p.primaryTypeDisplayName?.text,
        photo: p.photos?.[0]?.name
          ?`https://${process.env.RAPID_API_HOST}/v1/${p.photos[0].name}/media?maxWidthPx=600&maxHeightPx=400&skipHttpRedirect=true`
          : null,
        googleMapsUri: p.googleMapsUri,
      })) || [];

    return res.json({ results: places });
  } catch (error) {
    console.error("Google Search Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Search failed" });
  }
};

/**
 * 🏨 DETAILS CONTROLLER
 */
export const getPlaceDetailsController = async (req, res) => {
  try {
    const { placeId } = req.params;
    const data = await getPlaceDetailsService(placeId);
    res.json(data);
  } catch (error) {
    console.error("Details Error:", error.message);
    res.status(500).json({ message: "Cannot fetch details" });
  }
};

/**
 * 🖼 PHOTO CONTROLLER
 */
export const getPlacePhotoController = async (req, res) => {
  try {
    const { placeId, photoName } = req.params;
    const data = await getPlacePhotoService(placeId, photoName);
    res.json(data);
  } catch (error) {
    console.error("Photo Error:", error.message);
    res.status(500).json({ message: "Cannot fetch photo" });
  }
};
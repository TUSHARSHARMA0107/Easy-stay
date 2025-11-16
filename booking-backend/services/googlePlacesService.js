// services/googlePlacesService.js
import axios from "axios";

const RAPID_API_KEY = process.env.RAPID_API_KEY || process.env.RAPIDAPI_KEY;
const RAPID_API_HOST =
  process.env.RAPID_API_HOST || "google-map-places-new-v2.p.rapidapi.com";

/**
 * 🔍 Search for places (text query)
 */
export const searchPlacesService = async ({
  textQuery,
  latitude,
  longitude,
  radius = 10000,
  type = "",
  openNow = false,
  minRating = 0,
  maxResults = 10,
}) => {
  const url = `https://${RAPID_API_HOST}/v1/places:searchText`;

  const body = {
    textQuery,
    locationBias:
      latitude && longitude
        ? {
            circle: {
              center: { latitude, longitude },
              radius,
            },
          }
        : undefined,
    includedType: type || "",
    openNow,
    minRating,
    maxResultCount: maxResults,
    strictTypeFiltering: !!type,
  };

  const headers = {
    "Content-Type": "application/json",
    "x-rapidapi-host": RAPID_API_HOST,
    "x-rapidapi-key": RAPID_API_KEY,
    "X-Goog-FieldMask": "*",
  };

  const response = await axios.post(url, body, { headers });
  return response.data;
};

/**
 * 🏨 Full place details by ID
 */
export const getPlaceDetailsService = async (placeId) => {
  const url = `https://${RAPID_API_HOST}/v1/places/${placeId}`;

  const headers = {
    "x-rapidapi-host": RAPID_API_HOST,
    "x-rapidapi-key": RAPID_API_KEY,
    "X-Goog-FieldMask": "*",
  };

  const response = await axios.get(url, { headers });
  return response.data;
};

/**
 * 🖼 Photo for a place (optional)
 */
export const getPlacePhotoService = async (placeId, photoName) => {
  const url = `https://${RAPID_API_HOST}/v1/places/${placeId}/photos/${photoName}/media?maxWidthPx=600&maxHeightPx=400&skipHttpRedirect=true
`
  const headers = {
    "x-rapidapi-host": RAPID_API_HOST,
    "x-rapidapi-key": RAPID_API_KEY,
  };

  const response = await axios.get(url, { headers });
  return response.data;
};
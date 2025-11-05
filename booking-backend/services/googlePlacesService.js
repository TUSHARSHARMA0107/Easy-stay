import axios from "axios";

const RAPID_API_KEY = process.env.RAPIDAPI_KEY;
const RAPID_API_HOST = process.env.RAPIDAPI_HOST;

/**
 * 🔍 Search for places based on text, location, type, etc.
 */
export const searchPlaces = async ({
  textQuery,
  latitude,
  longitude,
  radius = 10000,
  type = "",
  openNow = false,
  minRating = 0,
  maxResults = 10
}) => {
  const url = `https://${RAPID_API_HOST}/v1/places:searchText`;

  const body = {
    textQuery,
    locationBias: {
      circle: {
        center: { latitude, longitude },
        radius,
      },
    },
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
 * 🏨 Get full details for a specific place (using placeId)
 */
export const getPlaceDetails = async (placeId) => {
  const url =`https://${RAPID_API_HOST}/v1/places/${placeId}`;

  const response = await axios.get(url, {
    headers: {
      "x-rapidapi-host": RAPID_API_HOST,
      "x-rapidapi-key": RAPID_API_KEY,
      "X-Goog-FieldMask": "*",
    },
  });

  return response.data;
};

/**
 * 🖼 Get photo link for a place (using photo name)
 */
export const getPlacePhoto = async (placeId, photoName) => {
  const url =` https://${RAPID_API_HOST}/v1/places/${placeId}/photos/${photoName}/media?maxWidthPx=600&maxHeightPx=400&skipHttpRedirect=true`;

  const response = await axios.get(url, {
    headers: {
      "x-rapidapi-host": RAPID_API_HOST,
      "x-rapidapi-key": RAPID_API_KEY,
    },
  });

  return response.data;
};
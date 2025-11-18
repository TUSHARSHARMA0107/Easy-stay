// services/googlePlacesService.js
import axios from "axios";

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = "google-map-places-new-v2.p.rapidapi.com";

const headers = {
  "Content-Type": "application/json",
  "x-rapidapi-key": RAPID_API_KEY,
  "x-rapidapi-host": RAPID_API_HOST,
  "X-Goog-FieldMask": "*",
};

// 🔍 SEARCH PLACES
export const searchPlacesService = async (query) => {
  const url = `https://${RAPID_API_HOST}/v1/places:searchText`;

  const body = {
    textQuery: query,
    maxResultCount: 12,
    languageCode: "en",
  };

  const res = await axios.post(url, body, { headers });
  return res.data?.places || [];
};

// 📍 PLACE DETAILS
export const getPlaceDetailsService = async (placeId) => {
  const url = `https://${RAPID_API_HOST}/v1/places/${placeId}`;
  const res = await axios.get(url, { headers });
  return res.data;
};

// 🖼 PLACE PHOTO
export const getPlacePhotoService = async (placeId, photoName) => {
  const url = `https://${RAPID_API_HOST}/v1/places/${placeId}/photos/${photoName}/media?maxWidthPx=600&maxHeightPx=400&skipHttpRedirect=true`;

  const res = await axios.get(url, {
    headers: {
      "x-rapidapi-key": RAPID_API_KEY,
      "x-rapidapi-host": RAPID_API_HOST,
    },
  });

  return res.data;
};
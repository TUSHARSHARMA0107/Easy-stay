import http from "../api/http";

export const searchPlaces = (params) =>
  http.get("/api/places/search", { params }).then((r) => r.data.results || []);

export const getPlaceDetails = (placeId) =>
  http.get(`/api/places/details/${placeId}`).then((r) => r.data.details);
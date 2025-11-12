import http from "./http";
export const getFavorites = () => http.get("/api/favorites").then(r => r.data);
export const saveFavorite = (payload) => http.post("/api/favorites", payload).then(r => r.data);
export const removeFavorite = (placeId) => http.delete(`/api/favorites/${placeId}`).then(r => r.data);
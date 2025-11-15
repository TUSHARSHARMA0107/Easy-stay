import http from "../api/http";

export const getReviews = (placeId) =>
  http.get(`/api/reviews/${placeId}`).then((r) => r.data);

export const addReview = (formData) =>
  http.post("/api/reviews", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const reportReview = (reviewId, reason = "") =>
  http.post("/api/reviews/report", { reviewId, reason });
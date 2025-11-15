import http from "../api/http";

export const comparePrices = (params) =>
  http.get("/api/compare", { params }).then((r) => r.data);


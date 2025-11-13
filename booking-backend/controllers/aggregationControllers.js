import { aggregateBusinesses } from "../services/aggregationsServices.js";

export const searchAggregate = async (req, res) => {
  const { q, location, sortBy } = req.query;
  if (!q && !location) return res.status(400).json({ message: "q or location required" });

  try {
    const data = await aggregateBusinesses({ query: q, location, sortBy });
    res.json(data);
  } catch (err) {
    console.error("searchAggregate:", err);
    res.status(500).json({ message: "Aggregation failed" });
  }
};
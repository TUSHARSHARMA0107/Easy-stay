// routes/searchRoute.js
import express from "express";
import { searchHotels } from "../services/hotelService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = (req.query.query || "").trim();
    if (!query) {
      return res.status(400).json({ msg: "query is required" });
    }

    const hotels = await searchHotels(query);

    return res.json({
      query,
      city: query,
      hotels,
    });
  } catch (err) {
    console.error("SEARCH ROUTE ERROR:", err.message);
    return res.status(500).json({ msg: "Search API failed" });
  }
});

export default router;
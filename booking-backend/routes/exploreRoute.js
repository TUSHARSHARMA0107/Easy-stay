// routes/exploreRoute.js
import express from "express";
import { searchHotels } from "../services/hotelService.js";
import { buildAttractions } from "../services/attractionService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const city = (req.query.query || "Goa").trim();

    // Hotels for city (normalized list)
    const hotels = await searchHotels(city);

    // Attractions for city (normalized with images)
    const attractions = await buildAttractions(city);

    return res.json({
      destination: {
        city,
      },
      hotels,
      attractions,
    });
  } catch (err) {
    console.error("EXPLORE ROUTE ERROR:", err.message);
    return res.status(500).json({ msg: "Explore API failed" });
  }
});

export default router;
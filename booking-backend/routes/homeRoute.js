// routes/homeRoute.js
import express from "express";
import { searchHotels } from "../services/hotelService.js";
import { getImages } from "../services/imageService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const heroCities = ["Manali", "Shimla", "Goa"];
    const heroDestinations = [];

    // Hero images from Google
    for (const city of heroCities) {
      const images = await getImages(`${city} tourism`, 1);
      heroDestinations.push({
        name: city,
        image: images[0] || null,
      });
    }

    const trendingCity = "Goa";

    // Hotels for trending city
    const hotels = await searchHotels(trendingCity); // already normalized array

    return res.json({
      heroDestinations,
      trendingCity,
      hotels,
    });
  } catch (err) {
    console.error("HOME ROUTE ERROR:", err.message);
    return res.status(500).json({ msg: "Home API failed" });
  }
});

export default router;
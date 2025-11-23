// routes/hotelsRoute.js
import express from "express";
import {
  autoHotelSearch,
  getHotelDetail,
} from "../services/hotelService.js";

const router = express.Router();

// 🔹 Auto-complete for search suggestions
router.get("/auto", async (req, res) => {
  try {
    const query = (req.query.query || "").trim();
    if (!query) return res.json([]);

    const list = await autoHotelSearch(query);
    return res.json(list);
  } catch (err) {
    console.error("HOTEL AUTO ROUTE ERROR:", err.message);
    return res.status(500).json({ msg: "Auto-complete failed" });
  }
});

// 🔹 Full hotel detail for dropdown + detail page
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const detail = await getHotelDetail(id);

    if (!detail) {
      return res.status(404).json({ msg: "Hotel not found" });
    }

    return res.json(detail);
  } catch (err) {
    console.error("HOTEL DETAIL ROUTE ERROR:", err.message);
    return res.status(500).json({ msg: "Hotel detail failed" });
  }
});

export default router;
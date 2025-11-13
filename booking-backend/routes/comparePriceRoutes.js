import express from "express";
import { compareHotelPrices } from "../controllers/comparePriceController.js";

const router = express.Router();

// Example: /api/compare-prices?name=Taj+Palace+Hotel&location=Delhi
router.get("/", compareHotelPrices);

export default router;
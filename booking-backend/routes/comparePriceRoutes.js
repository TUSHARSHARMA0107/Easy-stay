import express from "express";
import { comparePrices } from "../controllers/comparePriceController.js";

const router = express.Router();

// Example: /api/compare-prices?name=Taj+Palace+Hotel&location=Delhi
router.get("/", comparePrices);

export default comparePriceRoutes;
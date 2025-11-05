import express from "express";
import { searchBusinesses } from "../controllers/businessSearchController.js";

const router = express.Router();

// Example: /api/search?query=hotels+in+delhi&type=lodging
router.get("/", searchBusinesses);

export default businessSearchRoutes;
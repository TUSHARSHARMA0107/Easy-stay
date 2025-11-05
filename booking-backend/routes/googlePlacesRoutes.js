import express from "express";
import {
  searchPlacesController,
  getPlaceDetailsController,
  getPlacePhotoController,
} from "../controllers/googlePlacesController.js";

const router = express.Router();
// Route: GET /api/google/places/search
router.get("/search", searchPlaces);


export default googlePlacesRoutes;

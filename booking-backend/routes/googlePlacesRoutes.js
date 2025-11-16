// routes/googlePlacesRoutes.js
import express from "express";
import {
  searchPlacesController,
  getPlaceDetailsController,
  getPlacePhotoController,
} from "../controllers/googlePlacesController.js";

const router = express.Router();

// /api/places/search?query=manali
router.get("/search", searchPlacesController);

// /api/places/details/PLACE_ID
router.get("/details/:placeId", getPlaceDetailsController);

// /api/places/photo/:placeId/:photoName
router.get("/photo/:placeId/:photoName", getPlacePhotoController);

export default router;
import express from "express";
import {
  searchPlaces,
  getPlaceDetailsController,
  getPlacePhotoController,
} from "../controllers/googlePlacesController.js";

const router = express.Router();

// Search for places
router.get("/search", searchPlaces);

// Get detailed info for a place
router.get("/details/:placeId", getPlaceDetailsController);

// Get specific photo by media ID
router.get("/photo/:photoId", getPlacePhotoController);

export default router;

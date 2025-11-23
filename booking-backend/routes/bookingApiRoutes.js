// routes/bookingApiRoutes.js
import express from "express";
import {
  autoCompleteHotels,
  searchHotels,
  getHotelDetail,
  getHotelPhotos,
  getHotelDescription,
  getHotelReviews,
  getAttractionImages,
  getHomeSections,
} from "../controllers/bookingapiController.js";

const router = express.Router();

// ⭐ HOME PAGE content (Shimla, Goa, Assam)
router.get("/home-sections", getHomeSections);

// ⭐ Hotels autocomplete & search
router.get("/hotels/auto-complete", autoCompleteHotels);  // ?q=Shimla
router.get("/hotels/search", searchHotels);               // ?locationId=...

// ⭐ Single hotel info
router.get("/hotels/:hotelId/detail", getHotelDetail);
router.get("/hotels/:hotelId/photos", getHotelPhotos);
router.get("/hotels/:hotelId/description", getHotelDescription);
router.get("/hotels/:hotelId/reviews", getHotelReviews);

// ⭐ Attraction / city images
router.get("/images", getAttractionImages);               // ?q=Shimla tourist places

export default router;
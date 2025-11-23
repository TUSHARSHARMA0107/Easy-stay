import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  registerBusiness,
  getMyBusinesses,
  addBusinessImage,
  deleteBusinessImage,
  addRoom,
  deleteRoom,
  deleteBusiness,
  updateBusiness,
  getBusinessDetails,
  getAllBusinesses,
  getBusinessBookings,
  cancelBooking
} from "../controllers/businessController.js";

const router = express.Router();  // ✅ FIXED — router defined

// -----------------------------
// BUSINESS ROUTES
// -----------------------------

// Create new business
router.post(
  "/create",
  authMiddleware,
  upload.array("images", 10),
  registerBusiness
);

// Get all business of logged-in owner
router.get("/my", authMiddleware, getMyBusinesses);

// Get all businesses public
router.get("/all", getAllBusinesses);

// Get single business details
router.get("/:id", getBusinessDetails);

// Update business info
router.put("/:id", authMiddleware, updateBusiness);

// Add business image
router.post("/:id/images", authMiddleware, upload.single("image"), addBusinessImage);

// Delete business image
router.delete("/:id/images", authMiddleware, deleteBusinessImage);

// Add room to business
router.post("/:id/rooms", authMiddleware, addRoom);

// Delete room
router.delete("/rooms/:roomId", authMiddleware, deleteRoom);

// Delete a full business
router.delete("/:id", authMiddleware, deleteBusiness);

//Confirm export
router.post("/booking/:bookingId/confirm", authMiddleware, getBusinessBookings);


//delete export
router.post("/booking/:bookingId/cancel", authMiddleware, cancelBooking);

export default router;   // ✅ FIXED

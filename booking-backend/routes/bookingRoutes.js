import express from "express";
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  confirmBooking,
  rejectBooking,
  getUserBookingHistory,
  getOwnerBookingHistory,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("USER"), createBooking);
router.get("/user", protect, allowRoles("USER"), getUserBookings);
router.get("/owner", protect, allowRoles("OWNER"), getOwnerBookings);
router.patch("/:id/confirm", protect, allowRoles("OWNER"), confirmBooking);
router.patch("/:id/reject", protect, allowRoles("OWNER"), rejectBooking);
router.get("/user/history", protect, allowRoles("USER"), getUserBookingHistory);
router.get("/owner/history", protect, allowRoles("OWNER"), getOwnerBookingHistory);

export default router;
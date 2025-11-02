import express from "express";
import multer from "multer";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as businessController from "../controllers/businessController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// small memory multer for image uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// public: list & details (implemented elsewhere)
router.get("/", asyncHandler(businessController.listBusinesses));
router.get("/:id", asyncHandler(businessController.getBusinessById));

// Owner-only: create business
router.post("/", protect, allowRoles("OWNER"), asyncHandler(businessController.createBusiness));

// Owner-only: upload a single image to a business
router.post("/:id/images", protect, allowRoles("OWNER"), upload.single("image"), asyncHandler(businessController.uploadBusinessImage));

export default router;
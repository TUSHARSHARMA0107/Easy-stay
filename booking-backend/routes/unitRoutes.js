import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import * as unitController from "../controllers/unitController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

// Owner routes
router.post("/", protect, allowRoles("OWNER"), asyncHandler(unitController.createUnit));
router.patch("/:id", protect, allowRoles("OWNER"), asyncHandler(unitController.updateUnit));
router.delete("/:id", protect, allowRoles("OWNER"), asyncHandler(unitController.deleteUnit));
router.get("/business/:businessId", protect, allowRoles("OWNER"), asyncHandler(unitController.getUnitsByBusiness));

export default router;
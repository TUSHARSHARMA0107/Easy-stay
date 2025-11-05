import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Multer setup for local uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/me", protect, getProfile);
router.put("/update", protect, upload.single("image"), updateProfile);

export default profileRoutes;
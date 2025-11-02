import express from "express";
import upload from "../middleware/multer.js";
import { uploadProfileImage } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload-dp", protect, upload.single("image"), uploadProfileImage);

export default router;
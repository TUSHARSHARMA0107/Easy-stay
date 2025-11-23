import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getProfile, uploadAvatar, updateProfile, setRole } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), uploadAvatar);
router.post("/update", authMiddleware, updateProfile);
router.post("/set-role", authMiddleware, setRole);

export default router;
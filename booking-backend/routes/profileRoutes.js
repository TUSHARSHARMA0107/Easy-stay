import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadAvatar } from "../controllers/profileController.js";

const router = express.Router();

router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);

export default router;
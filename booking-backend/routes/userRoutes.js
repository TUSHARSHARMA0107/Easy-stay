import express from "express";
import upload from "../middleware/multer.js";
import { uploadProfileImage } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload-dp", protect, upload.single("image"), uploadProfileImage);

import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";
import { updatePhoto } from "../controllers/userController.js";

const upload = multer(); // buffer storage

router.post("/photo", authMiddleware, upload.single("photo"), updatePhoto);


export default router;

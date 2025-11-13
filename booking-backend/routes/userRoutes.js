import express from "express";
import upload from "../middleware/multer.js";
import { uploadProfileImage, updatePhoto } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";




const router = express.Router();

router.post("/upload-dp", protect, upload.single("image"), uploadProfileImage);

import multer from "multer";




router.post("/photo", protect, upload.single("photo"), updatePhoto);


export default router;

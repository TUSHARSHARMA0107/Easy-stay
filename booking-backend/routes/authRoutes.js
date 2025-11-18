import express, { Router } from "express";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
  router.post("/google",googleAuth);

export default router;








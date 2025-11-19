import express from "express";
import { registerUser, loginUser, googleAuth } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

// Public routes
authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/google", googleAuth);

// Example private route
authRoutes.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Profile accessed", user: req.user });
});

export default authRoutes;





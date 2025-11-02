import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../prismaClient.js";
import { sendEmail } from "../services/emailServices.js";
import { registerUser, loginUser, getMe } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);


// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // redirect back to frontend with token in URL
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);
// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

// Login
router.post("/login", loginUser);

// Get logged-in user info (for frontend dashboard)
router.get("/me", protect, getMe);

//email forget password
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Token missing" });

  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verificationToken: null },
  });

  res.json({ message: "Email verified successfully. You can now log in." });
});
// email reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken },
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail(
    email,
    "Reset your Easy-Stay password",
    `<p>Click the link below to reset your password:</p>
     <a href="${resetLink}">Reset Password</a>`
  );

  res.json({ message: "Password reset email sent" });
});







export default router;
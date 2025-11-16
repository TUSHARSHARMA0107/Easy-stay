import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import passport from "passport";
import "./config/passport.js";
import bodyParser from "body-parser";

// Import all routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import googlePlacesRoutes from "./routes/googlePlacesRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import businessSearchRoutes from "./routes/businessSearchRoutes.js";
import comparePriceRoutes from "./routes/comparePriceRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import logoutRoutes from "./routes/logoutRoutes.js";
import chatbotRoute from "./routes/chatbotRoute.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import aggregationRoutes from "./routes/aggregationRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session for Google OAuth
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "session-secret"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/google", googlePlacesRoutes);
app.use("/api/search", businessSearchRoutes);
app.use("/api/compare-prices", comparePriceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/chatbot", chatbotRoute);
app.use("/api/redirect", redirectRoutes);
app.use("/api/aggregate", aggregationRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/places", googlePlacesRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("EasyStay Backend API is running");
});

export default app;
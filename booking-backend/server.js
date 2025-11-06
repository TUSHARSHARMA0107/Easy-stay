import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import googlePlacesRoutes from "./routes/googlePlacesRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import businessSearchRoutes from "./routes/businessSearchRoutes.js";
import comparePriceRoutes from "./routes/comparePriceRoutes.js"
import passport from "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import session from "express-session";
import profileRoutes from "./routes/profileRoutes.js";
import logoutRoutes from "./routes/logoutRoutes.js";
import chatbotRoute from "./routes/chatbotRoute.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Normal routes
app.use(express.json());
// Also accept urlencoded bodies (HTML form submits)
app.use(express.urlencoded({ extended: true }));
/// Passport initialization
app.use(passport.initialize());
app.use("/api/auth/google", googleAuthRoutes);
// Payment routes (webhook uses raw parser internally)
app.use("/api/payments", paymentRoutes);

// Auth and other application routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/google",googlePlacesRoutes);
app.use("/api/search",businessRoutes);
app.use("/api/compare-prices",comparePriceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/chatbot",chatbotRoute)
// Example: other routes
// app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
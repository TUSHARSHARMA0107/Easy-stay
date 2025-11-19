import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import passport from "passport";
import "./config/passport.js";
import bodyParser from "body-parser";



// Import all routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import session from "express-session";
import paymentRoutes from "./routes/paymentRoutesjs";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "https://localhost:5173" || "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session for Google OAuth


// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/payment", paymentRoutes);


// Health Check
app.get("/", (req, res) => {
  res.send("EasyStay Backend API is running");
});

export default app;
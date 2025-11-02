import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieSessionf from "cookie-session";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/authRoutes";
import UserRoutes from "./routes/userRoutes";
import businessRoutes from "./routes/businessRoutes";
import unitRoutes from "./routes/uintRoutes";
import bookingRoutes from "./routes/bookingRoutes";

dotenv.config();

const app = express();

// Middleware


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

//session for google oauth
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(passport.initialize());
app.use(passport.session());


//routes
app.use("/auth",authRoutes);
app.use("/user",UserRoutes);
app.use("/api/business",businessRoutes);
app.use("/api/unit",unitRoutes);
app.use("/api/booking",bookingRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("EasyStay Backend API is running ");
});

export default app;
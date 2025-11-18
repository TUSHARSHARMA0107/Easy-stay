import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import passport from "passport";
import "./config/passport.js";
import bodyParser from "body-parser";

// Import all routes


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


// Health Check
app.get("/", (req, res) => {
  res.send("EasyStay Backend API is running");
});

export default app;
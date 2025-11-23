import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();


import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import homeRoutes from "./routes/homeRoute.js";
import exploreRoutes from "./routes/exploreRoute.js";
import searchRoutes from "./routes/searchRoute.js";
import hotelsRoutes from "./routes/hotelRoutes.js";


import bookingApiRoutes from "./routes/bookingApiRoutes.js";







const app = express();

// CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// 🟢 BODY PARSER FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// ROUTES AFTER body-parser

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);


app.use("/api/explore", exploreRoutes); 

app.use("/api/home", homeRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/hotels",hotelsRoutes);

///rapidapi booking API routes
app.use("/api/booking", bookingApiRoutes);


// Health Check
app.get("/", (req, res) => {
  res.send("EasyStay Backend API is running");
});

export default app;
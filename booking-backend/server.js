import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

// Normal routes
app.use(express.json());
// Also accept urlencoded bodies (HTML form submits)
app.use(express.urlencoded({ extended: true }));

// Payment routes (webhook uses raw parser internally)
app.use("/api/payments", paymentRoutes);

// Auth and other application routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/units", unitRoutes);

// Example: other routes
// app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
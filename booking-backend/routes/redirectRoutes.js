import express from "express";
import { handleExternalRedirect } from "../controllers/redirectController.js";

const router = express.Router();

// Example: /api/redirect?url=https://booking.com/hotel/123
router.get("/", handleExternalRedirect);

export default router;
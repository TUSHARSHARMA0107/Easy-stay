import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { generateInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/:id", authMiddleware, generateInvoice);

export default invoiceRoutes;
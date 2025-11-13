import express from "express";
import { protect} from "../middleware/auth.js";
import { generateInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/:id", protect, generateInvoice);

export default router;
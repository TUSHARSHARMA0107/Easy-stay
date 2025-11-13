import express from "express";
import { searchAggregate } from "../controllers/aggregationControllers.js";
import { aggregateBusinesses } from "../services/aggregationsServices.js";

const router = express.Router();
router.get("/search", searchAggregate);

export default router;
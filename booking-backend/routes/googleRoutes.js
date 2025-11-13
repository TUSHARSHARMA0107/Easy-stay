import express from "express";
import * as googleController from "../controllers/googleController.js";
const router = express.Router();

router.get("/search", googleController.searchPlaces);
router.get("/place/:placeId", googleController.getPlace);
router.get("/compare", googleController.compareListing);

export default router;
import express from "express";
import { flightOffers } from "../controllers/flightController.js";
const router = express.Router();

router.post("/post", flightOffers);

export default router;

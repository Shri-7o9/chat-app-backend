import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// send message (protected)
router.post("/send", protectRoute, sendMessage);

export default router;
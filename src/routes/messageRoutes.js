import express from "express";
import { sendMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/send", sendMessages);

export default router;
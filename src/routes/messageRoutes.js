import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  reactToMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

// React to a message
router.post("/react/:id", protectRoute, reactToMessage);

export default router;
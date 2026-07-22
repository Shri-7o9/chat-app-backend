import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  getMessageRequests,
  acceptMessageRequest,
  blockMessageRequest,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);

// specific routes
router.get("/requests", protectRoute, getMessageRequests);
router.put("/requests/accept/:userId", protectRoute, acceptMessageRequest);
router.put("/requests/block/:userId", protectRoute, blockMessageRequest);

// wildcard route
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;

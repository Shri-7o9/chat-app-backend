import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  getMessageRequests,
  reactToMessage,
  acceptMessageRequest,
  blockMessageRequest,
  deleteMessage,
  forwardMessage,
} from "../controllers/messageController.js";
import { getSidebarUsers } from "../controllers/sideBarController.js";

const router = express.Router();

// connections only sidebar
router.get("/users", protectRoute, getSidebarUsers);

// specific routes ABOVE wildcard /:id
router.get("/requests", protectRoute, getMessageRequests);
router.put("/requests/accept/:userId", protectRoute, acceptMessageRequest);
router.put("/requests/block/:userId", protectRoute, blockMessageRequest);

// wildcard routes LAST
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

// React to a message
router.post("/react/:id", protectRoute, reactToMessage);

// Forward message
router.post("/forward", protectRoute, forwardMessage);

// DELETE a message
router.delete("/:messageId", protectRoute, deleteMessage);

export default router;

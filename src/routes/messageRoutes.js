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
  deleteMessageForMe,
  unsendMessage,
  forwardMessage,
  editMessage,
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
router.post("/forward/:messageId", protectRoute, forwardMessage);

// Edit message
router.put("/edit/:messageId", protectRoute, editMessage);

// Delete a message for me only (hides it for the requester)
router.delete("/delete-for-me/:messageId", protectRoute, deleteMessageForMe);

// Unsend a message (sender removes it for everyone)
router.delete("/unsend/:messageId", protectRoute, unsendMessage);

export default router;

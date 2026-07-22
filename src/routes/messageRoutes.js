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

export default router;

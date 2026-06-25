import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, getMessages } from "../controllers/messageController.js";

const router = express.Router();

// Endpoint 1: GET /api/messages/user (Fetch all users except current user)
router.get("/user", protectRoute, getUsersForSidebar);

// Endpoint 2: GET /api/messages/:id (Fetch chat history with specific user)
router.get("/:id", protectRoute, getMessages);

export default router;
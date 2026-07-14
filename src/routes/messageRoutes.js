import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getUsersForSidebar, getMessages, sendMessage, editMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.patch("/edit/:id", protectRoute, editMessage);

export default router;
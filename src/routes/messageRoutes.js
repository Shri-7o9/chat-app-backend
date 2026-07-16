import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/messageController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", 
    protectRoute,
    upload.single("image"),//added by pp
    sendMessage,
);

export default router;


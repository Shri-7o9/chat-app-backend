import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";

import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  forwardMessage,
} from "../controllers/messageController.js";


const router = express.Router();


router.get("/user", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);  

router.post("/forward/:id", protectRoute, forwardMessage);


export default router;
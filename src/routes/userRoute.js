import express from "express";
import { updateUser } from "../controllers/updateController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

export default router;
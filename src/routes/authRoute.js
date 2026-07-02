import express from "express";

import {
    registerUser,
loginUser, 
verifyEmail
} from "../controllers/authController.js";
import { login } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login",loginUser);
router.post("/logout",protectRoute,logoutUser);
router.post("/register",registerUser);

export default router;

import express from "express";

import { signup } from "../controllers/signupController.js";
import { login } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", protectRoute, logoutUser);
router.post("/signup", signup);

export default router;

import express from "express";

import { signup } from "../controllers/signupController.js";
import { loginUser } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import { updateUser } from "../controllers/updateController.js";

import { verifyEmail } from "../controllers/authController.js";
import { forgotPassword } from "../controllers/forgotPasswordController.js";
import { resetPassword } from "../controllers/resetPasswordController.js";

import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginUser);

router.post("/logout", protectRoute, logoutUser);
router.put("/update", protectRoute, updateUser);

router.get("/verify/:token", verifyEmail);

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
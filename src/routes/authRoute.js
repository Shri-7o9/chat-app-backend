import express from "express";

import { signup } from "../controllers/signupController.js";
import { login } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import { forgotPassword } from "../controllers/forgotPasswordController.js";
import { resetPassword } from "../controllers/resetPasswordController.js";
import { updateUser } from "../controllers/updateController.js";
import { checkAuth } from "../controllers/checkController.js";

import { verifyEmail } from "../controllers/authController.js";

import { protectRoute } from "../middleware/authMiddleware.js";


const router = express.Router();


// Authentication
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);


// User
router.post("/logout", protectRoute, logoutUser);
router.put("/update-profile", protectRoute, updateUser);


// Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.get("/check", protectRoute, checkAuth);


export default router;
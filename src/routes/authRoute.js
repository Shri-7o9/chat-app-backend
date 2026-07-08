import express from "express";
import { signup } from "../controllers/signupController.js";
import { login } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import { forgotPassword } from "../controllers/forgotPasswordController.js";
import { resetPassword } from "../controllers/resetPasswordController.js";
import protectRoute from "../middleware/protectRoute.js";
import { verifyEmail } from "../controllers/signupController.js";
const router = express.Router();

router.post("/signup", signup)
router.get("/verify/:token", verifyEmail);;
router.post("/login", login);
router.post("/logout", protectRoute, logoutUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
import express from "express";

import { signup } from "../controllers/signupController.js";
import { login } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { resetPassword } from "../controllers/resetPasswordController.js";
import { forgotPassword } from "../controllers/forgotPasswordController.js";
import { updateUser } from "../controllers/updateController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", protectRoute, logoutUser);
router.put("/update-profile", protectRoute, updateUser);

router.post("/reset-password/:token", resetPassword);
router.post("/forget-password", forgotPassword);

export default router;

import express from "express";
import { signup, login, logout, updateProfile, forgotPassword, resetPassword} from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";
import { checkAuth } from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Update Profile - fullName and userName
router.put("/update-profile", protectRoute, updateProfile);

// Check Authentication
router.get("/check", protectRoute, checkAuth);

//addeded new line
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
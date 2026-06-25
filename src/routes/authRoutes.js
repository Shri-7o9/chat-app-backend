import express from "express";
import { signup, login, logout, updateProfile  } from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// Update Profile - fullName and userName
router.put("/update-profile", protectRoute, updateProfile);

// Check Authentication
router.get("/check", protectRoute, checkAuth);

export default router;
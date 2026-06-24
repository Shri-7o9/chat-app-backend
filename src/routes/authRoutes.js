import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controllers/authController.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected route
router.get("/check", protectRoute, checkAuth);

export default router;

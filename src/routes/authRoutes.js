import express from "express"
import { login, logout, signup, updateProfile } from "../controllers/authController.js";

const router = express.Router();

router.get("/signup", signup);
router.get("/login", login);
router.get("/logout", logout);
router.get("/update-profile", updateProfile);

export default router;

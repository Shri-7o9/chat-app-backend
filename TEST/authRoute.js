import express from "express";
import { signup, login, logout } from "../../TEST/authController.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
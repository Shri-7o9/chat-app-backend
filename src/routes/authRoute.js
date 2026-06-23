import express from "express";
import { generateToken } from "../lib/utils.js";
import { register, login } from "../controllers/authController.js";
import { logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/login", (req, res) => {
  generateToken("123456", res);

  res.json({
    message: "Logged in successfully",
  });
});

export default router;
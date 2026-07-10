import express from "express";
import { updateUser } from "../controllers/updateController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateUser
);

export default router;
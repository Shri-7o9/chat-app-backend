import express from "express";

import { signup } from "../controllers/signupController.js";
import { login } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { resetPassword } from "../controllers/resetPasswordController.js";
import { forgotPassword } from "../controllers/forgotPasswordController.js";
import { updateUser } from "../controllers/updateController.js";
import { checkAuth } from "../controllers/checkController.js";
import { searchUsers } from "../controllers/searchController.js";
import { addConnection } from "../controllers/addConnectionController.js";
import { getSidebarUsers } from "../controllers/sideBarController.js";
import { removeConnection } from "../controllers/removeConnectionController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", protectRoute, logoutUser);
router.put("/update-profile", protectRoute, updateUser);

router.post("/reset-password/:token", resetPassword);
router.post("/forget-password", forgotPassword);

// const user = await User.findOne({ email });

router.get("/check", protectRoute, checkAuth);
router.get('/search', protectRoute, searchUsers);

router.post("/connect", protectRoute, addConnection);
router.delete("/disconnect", protectRoute, removeConnection);

// Route to get only connected users for the sidebar
// GET /api/auth/sidebar
router.get("/sidebar", protectRoute, getSidebarUsers);

export default router;

import express from "express";
import { getMe, login, logout, register } from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", protectRoute, getMe);
router.post("/logout", protectRoute, logout);

export default router;

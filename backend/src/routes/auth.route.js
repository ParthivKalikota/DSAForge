import express from "express";
import { register, login, getMe, createFirstAdmin } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log(`Auth Route accessed: ${req.method} ${req.url}`);
    next();
});

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/create-first-admin", createFirstAdmin);

export default router;

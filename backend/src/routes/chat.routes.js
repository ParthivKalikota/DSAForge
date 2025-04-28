import express from "express";
import { getQuestionChats, sendMessage, getUserChats, getActiveDiscussions } from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all chat routes
router.use(verifyToken);

// Get active discussions (questions with chat activity)
router.get("/active-discussions", getActiveDiscussions);

// Get chats for a specific question
router.get("/question/:questionId", getQuestionChats);

// Send a message in a chat
router.post("/question/:questionId/message", sendMessage);

// Get recent chats for the current user
router.get("/user", getUserChats);

export default router;

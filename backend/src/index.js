import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import questionRoutes from "./routes/question.route.js";
import progressRoutes from "./routes/progress.route.js";
import adminRoutes from "./routes/admin.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());  // Allow all origins in development

// Routes
app.use("/api/auth", authRoutes);  // Mount auth routes under /api/auth
app.use("/api/questions", questionRoutes);  // Mount question routes under /api/questions
app.use("/api/progress", progressRoutes);  // Mount progress routes under /api/progress
app.use("/api/admin", adminRoutes);  // Mount admin routes under /api/admin
app.use("/api/feedback", feedbackRoutes);  // Mount feedback routes under /api/feedback
app.use("/api/chats", chatRoutes);  // Mount chat routes under /api/chats

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    message: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the API at http://localhost:${PORT}/health`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

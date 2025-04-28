import express from 'express';
import { getAllQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion } from '../controllers/question.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log(`Question Route accessed: ${req.method} ${req.url}`);
    next();
});

// Public routes
router.get('/', getAllQuestions);
router.get('/:id', getQuestion);

// Protected admin routes
router.post('/', verifyToken, isAdmin, createQuestion);
router.put('/:id', verifyToken, isAdmin, updateQuestion);
router.delete('/:id', verifyToken, isAdmin, deleteQuestion);

export default router;

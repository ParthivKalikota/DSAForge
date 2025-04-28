import express from 'express';
import { getUserProgress, updateQuestionStatus, getRevisionQuestions, getSolvedQuestions } from '../controllers/progress.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(verifyToken);

router.get('/', getUserProgress);
router.post('/update-status', updateQuestionStatus);
router.get('/revision', getRevisionQuestions);
router.get('/solved', getSolvedQuestions);

export default router;

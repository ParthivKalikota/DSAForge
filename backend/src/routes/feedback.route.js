import express from 'express';
import { addFeedback, getStudentFeedback } from '../controllers/feedback.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken, isAdmin);

router.post('/', addFeedback);
router.get('/student/:studentId', getStudentFeedback);

export default router;

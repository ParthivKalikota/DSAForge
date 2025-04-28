import express from 'express';
import { getAllStudents, getStudentProgress, getOverallStats } from '../controllers/admin.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken, isAdmin);

router.get('/students', getAllStudents);
router.get('/students/:studentId/progress', getStudentProgress);
router.get('/stats', getOverallStats);

export default router;

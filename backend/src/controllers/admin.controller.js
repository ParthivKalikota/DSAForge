import User from '../models/User.model.js';
import Progress from '../models/Progress.model.js';

// Get all students (non-admin users)
export const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ isAdmin: false }, '-password');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get progress for a specific student
export const getStudentProgress = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Verify student exists
        const student = await User.findById(studentId, '-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get student's progress with populated question details
        const progress = await Progress.find({ user: studentId })
            .populate('question')
            .populate('user', 'name email')
            .sort({ updatedAt: -1 });

        // Calculate statistics
        const stats = {
            totalQuestions: await Progress.countDocuments({ user: studentId }),
            solvedQuestions: await Progress.countDocuments({ user: studentId, status: 'Solved' }),
            needsRevision: await Progress.countDocuments({ user: studentId, status: 'NeedsRevision' }),
            lastActive: student.lastActive
        };

        res.status(200).json({ student, progress, stats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get overall statistics for all students
export const getOverallStats = async (req, res) => {
    try {
        const students = await User.find({ isAdmin: false });
        const stats = await Promise.all(
            students.map(async (student) => {
                const totalQuestions = await Progress.countDocuments({ user: student._id });
                const solvedQuestions = await Progress.countDocuments({ 
                    user: student._id,
                    status: 'Solved'
                });
                const needsRevision = await Progress.countDocuments({ 
                    user: student._id,
                    status: 'NeedsRevision'
                });

                return {
                    student: {
                        _id: student._id,
                        name: student.name,
                        email: student.email
                    },
                    stats: {
                        totalQuestions,
                        solvedQuestions,
                        needsRevision,
                        completionRate: totalQuestions ? (solvedQuestions / totalQuestions * 100).toFixed(1) : 0
                    }
                };
            })
        );

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

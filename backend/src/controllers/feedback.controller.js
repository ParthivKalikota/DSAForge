import Feedback from '../models/Feedback.model.js';

// Add feedback for a student
export const addFeedback = async (req, res) => {
    try {
        const { studentId, content, rating } = req.body;
        
        const feedback = await Feedback.create({
            student: studentId,
            givenBy: req.user._id,
            content,
            rating
        });

        await feedback.populate(['student', 'givenBy']);
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get feedback for a student
export const getStudentFeedback = async (req, res) => {
    try {
        const { studentId } = req.params;
        const feedback = await Feedback.find({ student: studentId })
            .populate(['student', 'givenBy'])
            .sort({ createdAt: -1 });
        res.status(200).json(feedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

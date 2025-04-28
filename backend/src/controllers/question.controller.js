import Question from '../models/Question.model.js';
import Progress from '../models/Progress.model.js';

// Get all questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('addedBy', 'name');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single question
export const getQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate('addedBy', 'name');
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create question (admin only)
export const createQuestion = async (req, res) => {
    try {
        const newQuestion = new Question({
            ...req.body,
            addedBy: req.user._id,
            lastModifiedBy: req.user._id
        });
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update question (admin only)
export const updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                lastModifiedBy: req.user._id,
                lastModifiedAt: Date.now()
            },
            { new: true }
        );
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete question (admin only)
export const deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        // Also delete all progress records associated with this question
        await Progress.deleteMany({ question: req.params.id });
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

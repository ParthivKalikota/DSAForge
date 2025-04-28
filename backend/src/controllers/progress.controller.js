import Progress from '../models/Progress.model.js';

// Get user's progress for all questions
export const getUserProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user._id })
            .populate('question')
            .sort({ updatedAt: -1 });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update question status (solved/unsolved/needs revision)
export const updateQuestionStatus = async (req, res) => {
    try {
        const { questionId, status, notes } = req.body;
        
        console.log(`Updating status for user ${req.user._id}, question ${questionId} to ${status}`);
        
        const progress = await Progress.findOneAndUpdate(
            { user: req.user._id, question: questionId },
            { 
                status,
                notes,
                lastAttempted: Date.now()
            },
            { new: true, upsert: true }
        ).populate('question');

        console.log('Updated progress:', JSON.stringify(progress));
        
        res.status(200).json(progress);
    } catch (error) {
        console.error('Error updating question status:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get questions that need revision
export const getRevisionQuestions = async (req, res) => {
    try {
        const revisionQuestions = await Progress.find({
            user: req.user._id,
            status: 'NeedsRevision'
        }).populate('question');
        res.status(200).json(revisionQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get solved questions
export const getSolvedQuestions = async (req, res) => {
    try {
        const solvedQuestions = await Progress.find({
            user: req.user._id,
            status: 'Solved'
        }).populate('question');
        res.status(200).json(solvedQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

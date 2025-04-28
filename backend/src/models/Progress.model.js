import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    status: {
        type: String,
        enum: ['Solved', 'Unsolved', 'NeedsRevision'],
        default: 'Unsolved'
    },
    lastAttempted: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { timestamps: true });

// Compound index to ensure a user can't have multiple progress records for the same question
progressSchema.index({ user: 1, question: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;

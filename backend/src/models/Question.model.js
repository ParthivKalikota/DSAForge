import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    platform_url: {
        type: String,
        required: true,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;

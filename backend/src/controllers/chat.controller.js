import mongoose from "mongoose";
import Question from "../models/Question.model.js";
import Chat from "../models/Chat.model.js";

// Get active discussions (questions with chat activity)
export const getActiveDiscussions = async (req, res) => {
  try {
    // Find chats with associated questions and participant info
    const chats = await Chat.find()
      .populate('question')
      .populate('participants', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getActiveDiscussions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all chats for a specific question
export const getQuestionChats = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    // Validate questionId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Invalid question ID format" });
    }
    
    // Check if question exists
    const questionExists = await Question.findById(questionId);
    if (!questionExists) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // Find or create chat for this question
    let chat = await Chat.findOne({ question: questionId })
      .populate({
        path: 'messages.sender',
        select: 'name email'
      });
    
    if (!chat) {
      chat = await Chat.create({
        question: questionId,
        messages: [],
        participants: [req.user._id]
      });
    } else if (!chat.participants.includes(req.user._id)) {
      // Add user to participants if not already included
      chat.participants.push(req.user._id);
      await chat.save();
    }
    
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error in getQuestionChats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send a message in a chat
export const sendMessage = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }
    
    // Validate questionId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Invalid question ID format" });
    }
    
    // Find or create chat for this question
    let chat = await Chat.findOne({ question: questionId });
    
    if (!chat) {
      chat = await Chat.create({
        question: questionId,
        messages: [],
        participants: [req.user._id]
      });
    } else if (!chat.participants.includes(req.user._id)) {
      // Add user to participants if not already included
      chat.participants.push(req.user._id);
    }
    
    // Add new message
    const newMessage = {
      sender: req.user._id,
      content,
      createdAt: new Date()
    };
    
    chat.messages.push(newMessage);
    // Update the chat's updatedAt timestamp
    chat.updatedAt = new Date();
    await chat.save();
    
    // Populate sender info before sending response
    const populatedChat = await Chat.findById(chat._id)
      .populate({
        path: 'messages.sender',
        select: 'name email'
      });
    
    const addedMessage = populatedChat.messages[populatedChat.messages.length - 1];
    
    res.status(201).json(addedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get recent chats for the current user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find chats where the user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate({
        path: 'question',
        select: 'title difficulty'
      })
      .sort({ updatedAt: -1 })
      .limit(10);
    
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getUserChats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

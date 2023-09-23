import chatModel from "../models/chatModel.js";
import { io } from "../index.js"; // Import the io instance
import mongoose from "mongoose";

export const sendChatController = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const newChat = new chatModel({
      sender,
      receiver,
      message,
      status: "sent",
      isRead: false,
    });

    await newChat.save();
    
    const conversationHistory = await chatModel.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    io.emit("receive-message", conversationHistory);

    return res.status(201).json({
      success: true,
      message: "Chat message sent successfully",
      chat: conversationHistory, // Send the entire conversation history as chat
    });
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({
      success: false,
      message: "Error sending chat message",
      error,
    });
  }
};

export const fetchConversationHistoryController = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    // const userId = req.user._id;
    const userId = req.query.currentUserId;

    const conversationHistory = await chatModel.find({
      $or: [
        { sender : new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(otherUserId) },
        { sender : new mongoose.Types.ObjectId(otherUserId), receiver: new mongoose.Types.ObjectId(userId) },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Conversation history fetched successfully",
      conversationHistory,
    });
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching conversation history",
      error,
    });
  }
};


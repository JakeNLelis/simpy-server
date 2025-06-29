import { HttpError } from "../config/error";
import ConversationModel from "../models/conversationModel";
import MessageModel from "../models/messageModel";
import UserModel from "../models/userModel";

// =================== Create Message ===================
// @desc    Create a new message in a conversation
// @route   POST /api/messages/:recieverId
// @access  Private
const createMessage = async (req, res, next) => {
  try {
    res.json("Create message");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Get Messages ===================
// @desc    Get all messages in a conversation
// @route   GET /api/messages/:receiverId
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    res.json("Get messages");
  } catch (error) {
    return next(new HttpError(error));
  }
};

// =================== Get Conversations ===================
// @desc    Get all the users you have conversations with
// @route   POST /api/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    res.json("Get conversations");
  } catch (error) {
    return next(new HttpError(error));
  }
};

export { createMessage, getMessages, getConversations };

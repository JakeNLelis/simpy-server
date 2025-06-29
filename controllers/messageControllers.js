import { HttpError } from "../config/error";
import ConversationModel from "../models/conversationModel";
import MessageModel from "../models/messageModel";
import { getReceiverSocketId, io } from "../socket/socket";

// =================== Create Message ===================
// @desc    Create a new message in a conversation
// @route   POST /api/messages/:recieverId
// @access  Private
const createMessage = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const { messageBody } = req.body;

    let conversation = await ConversationModel.findOne({
      participants: { $all: [req.user.id, receiverId] },
    });
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [req.user.id, receiverId],
        lastMessage: { text: messageBody, senderId: req.user.id },
      });
    }
    const newMessage = await MessageModel.create({
      conversationId: conversation._id,
      senderId: req.user.id,
      text: messageBody,
    });

    await ConversationModel.updateOne({
      lastMessage: { text: messageBody, senderId: req.user.id },
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
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
    const { receiverId } = req.params;

    const conversation = await ConversationModel.findOne({
      participants: { $all: [req.user.id, receiverId] },
    });

    if (!conversation) {
      return next(new HttpError("Conversation not found", 404));
    }

    const messages = await MessageModel.find({
      conversationId: conversation._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(messages);
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
    let conversations = await ConversationModel.find({
      participants: { $in: [req.user.id] },
    })
      .populate("participants", "fullName profilePhoto")
      .sort({ updatedAt: -1 });
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== req.user.id.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (error) {
    return next(new HttpError(error));
  }
};

export { createMessage, getMessages, getConversations };

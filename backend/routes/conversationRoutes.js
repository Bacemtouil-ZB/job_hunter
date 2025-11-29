import express from "express";
import asyncHandler from "express-async-handler";
import Conversation from "../models/ConversationModel.js";

const router = express.Router();

// Create or fetch a conversation between logged-in user and another user
router.post("/", asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id; // logged-in user's ObjectId
  const { receiverId } = req.body;     // the other user's ObjectId

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    members: { $all: [loggedInUserId, receiverId] }
  });

  if (conversation) return res.status(200).json(conversation);

  // Create new conversation
  conversation = new Conversation({
    members: [loggedInUserId, receiverId]
  });

  const savedConversation = await conversation.save();
  res.status(201).json(savedConversation);
}));

export default router;

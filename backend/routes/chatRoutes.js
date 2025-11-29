import express from "express";
import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// ------------------ CONVERSATIONS ------------------

// Create conversation between 2 users
router.post("/conversations", asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  // check if a conversation already exists
  let existing = await Conversation.findOne({
    members: { $all: [senderId, receiverId] }
  });

  if (existing) return res.status(200).json(existing);

  const newConv = new Conversation({ members: [senderId, receiverId] });
  const saved = await newConv.save();
  res.status(201).json(saved);
}));

// Get all conversations for a user
router.get("/conversations/:userId", asyncHandler(async (req, res) => {
  const conv = await Conversation.find({
    members: { $in: [req.params.userId] }
  }).populate("members", "name email profilePicture");

  res.json(conv);
}));

// ------------------ MESSAGES ------------------

// Get all messages of a conversation
router.get("/messages/:conversationId", asyncHandler(async (req, res) => {
  const msgs = await Message.find({
    conversationId: req.params.conversationId
  });
  res.json(msgs);
}));

// Send message
router.post("/messages", asyncHandler(async (req, res) => {
  const { conversationId, sender, text } = req.body;

  const newMsg = new Message({ conversationId, sender, text });
  const saved = await newMsg.save();

  res.status(201).json(saved);
}));
// Get one full conversation with members + messages
router.get("/conversation/:id", asyncHandler(async (req, res) => {
  const conv = await Conversation.findById(req.params.id)
    .populate("members", "name email profilePicture");

  if (!conv) return res.status(404).json({ message: "Conversation not found" });

  const msgs = await Message.find({ conversationId: req.params.id });

  res.json({
    ...conv.toObject(),
    messages: msgs
  });
}));


export default router;

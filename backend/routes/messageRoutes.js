import express from "express";
import Message from "../models/MessageModel.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Send message
router.post(
  "/messages",
  protect,   // <-- add this
  asyncHandler(async (req, res) => {
    const { conversationId, sender, text } = req.body;

    if (sender !== req.user._id) {
      return res.status(403).json({ message: "You cannot send as another user" });
    }

    const msg = new Message({ conversationId, sender, text });
    await msg.save();

    res.status(201).json(msg);
  })
);


// Get messages of a conversation
router.get(
  "/messages/:conversationId",
  protect,   // <-- ADD THIS
  asyncHandler(async (req, res) => {
    const conversationId = req.params.conversationId;

    // Check that this user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      members: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({ message: "You are not in this conversation" });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "name _id");

    res.json(messages);
  })
);


export default router;

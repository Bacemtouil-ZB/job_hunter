import express from "express";
import Message from "../models/MessageModel.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Send message
router.post(
  "/messages",
  asyncHandler(async (req, res) => {
    const { conversationId, sender, text } = req.body;
    if (!conversationId || !sender || !text)
      return res.status(400).json({ message: "Missing data" });

    const msg = new Message({ conversationId, sender, text });
    await msg.save();
    res.status(201).json(msg);
  })
);

// Get messages of a conversation
router.get(
  "/messages/:conversationId",
  asyncHandler(async (req, res) => {
    const messages = await Message.find({ conversationId: req.params.conversationId }).populate(
      "sender",
      "name _id"
    );
    res.json(messages);
  })
);

export default router;

import Conversation from "../models/ConversationModel.js";

// Create or find a private conversation
export const createOrGetConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "Missing user IDs" });
  }

  // Find existing conversation between the 2 users
  let conv = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  }).populate("members");

  if (!conv) {
    conv = await Conversation.create({
      members: [senderId, receiverId],
    });

    conv = await conv.populate("members");
  }

  res.json(conv);
};

// Get all conversations for ONE user
export const getUserConversations = async (req, res) => {
  const { userId } = req.params;

  const conversations = await Conversation.find({
    members: { $in: [userId] },
  }).populate("members");

  res.json(conversations);
};

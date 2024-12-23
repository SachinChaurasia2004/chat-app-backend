import { Conversation } from "../models/conversation_model.js";

export const getAllConversations = async (req, res, next) => {

  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({
      participants: userId
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, },
      })
      .populate({
        path: "participants",
        select: "username",
      });

    const formattedConversations = conversations.map((conversation) => {
      const otherUser = conversation.participants.find(
        (participant) => participant._id.toString() != userId
      );

      return {
        id: conversation._id,
        userId: otherUser._id,
        name: otherUser.username,
        lastMessage: conversation.messages?.[0]?.content,
        lastMessageTime: conversation.messages?.[0]?.createdAt
      };
    });

    res.status(200).json(
      formattedConversations,
    );
  } catch (error) {
    next(error);
  }
};
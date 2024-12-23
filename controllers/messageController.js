import { Message } from "../models/message_model.js";
import { Conversation } from "../models/conversation_model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const conversationId = req.params.id;
    const { content } = req.body;
    let conversation = await Conversation.findOne({
      _id: conversationId
       },
    )

    /*if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: [],
      });
      await conversation.save();
    }*/

    const message = new Message({
      conversationId,
      senderId,
      content,
    });
    await message.save();

    conversation.messages.push(message._id);
    await conversation.save();

    res.status(201).json({ message: "Message sent successfully", message });

  } catch (error) {
    next(error);
  }

}; 

export const getMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.id; 
    const conversation = await Conversation.findOne({
      _id: conversationId,
    }).populate({
      path: "messages",
      select: "content createdAt _id senderId",
    });

    if (!conversation) {
      return res.status(404).json({
        message: "No Conversation",
      });
    }

    const allMessages = conversation.messages.map((message) => ({
      ...message.toObject(),
      conversationId,
    }));

    res.status(200).json(
     allMessages,
    );
  } catch (error) {
    next(error);
  }
};

export const saveMessage = async (conversationId, senderId, content) => {
  try {
    const newMessage = new Message({
      conversationId,
      senderId,
      content,
    });
    const savedMessage = await newMessage.save();
    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: savedMessage._id },
        updatedAt: new Date(),
      },
      { new: true }
    );
    return savedMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error; 
  }
}

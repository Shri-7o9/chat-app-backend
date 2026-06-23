import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id; // from protectRoute middleware
    const { receiverId, text } = req.body;

    // check if receiver exists
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
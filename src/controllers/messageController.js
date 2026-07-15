
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.userId;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.userId;

    // Find the chat between the two users
    const chat = await Chat.findOne({
      participants: {
        $all: [myId, userToChatId],
        $size: 2,
      },
    });

    
    if (!chat) {
      return res.status(200).json([]);
    }

   
    const messages = await Message.find({
      chatId: chat._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    let imageUrl = "";

    if (image) {
      imageUrl = image;
    }

    
    let chat = await Chat.findOne({
      participants: {
        $all: [senderId, receiverId],
        $size: 2,
      },
    });

    
    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
      });
    }

   
    const newMessage = new Message({
      chatId: chat._id,
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};
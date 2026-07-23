import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

// Get all users except the logged-in user
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

// Get all messages between logged-in user and another user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.userId;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    let imageUrl = "";

    if (image) {
      imageUrl = image;
    }

    const newMessage = new Message({
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


// GET /messages/requests
export const getMessageRequests = async (req, res) => {
  try {
    const myId = req.userId;

    const me = await User.findById(myId).select("connections blockedUsers");

    // find all unique senders who sent messages to me
    const messagesReceived = await Message.find({
      receiverId: myId,
    }).distinct("senderId");

    // filter out people already in connections or blocked
    const requestSenderIds = messagesReceived.filter(
      (senderId) =>
        !me.connections.some((c) => c.toString() === senderId.toString()) &&
        !me.blockedUsers?.some((b) => b.toString() === senderId.toString()) &&
        senderId.toString() !== myId.toString(),
    );

    // get user details AND their last message preview
    const requestsWithLastMessage = await Promise.all(
      requestSenderIds.map(async (senderId) => {
        const user = await User.findById(senderId).select("-password");
        const lastMessage = await Message.findOne({
          senderId,
          receiverId: myId,
        }).sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          lastMessage: lastMessage?.text || "",
        };
      }),
    );

    res.status(200).json(requestsWithLastMessage);
  } catch (error) {
    console.error("Error in getMessageRequests:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /messages/requests/accept/:userId
export const acceptMessageRequest = async (req, res) => {
  try {
    const myId = req.userId;
    const { userId } = req.params;

    // add each other to connections
    await User.findByIdAndUpdate(myId, { $addToSet: { connections: userId } });
    await User.findByIdAndUpdate(userId, { $addToSet: { connections: myId } });
    
    const acceptedUser = await User.findById(userId).select("-password");

    res.status(200).json(acceptedUser);
  } catch (error) {
    console.error("Error in acceptMessageRequest:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /messages/requests/block/:userId
export const blockMessageRequest = async (req, res) => {
  try {
    const myId = req.userId;
    const { userId } = req.params;

    // add to blocked users
    await User.findByIdAndUpdate(myId, {
      $addToSet: { blockedUsers: userId },
    });

    // delete all messages between the two users
    await Message.deleteMany({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    });

    const blockedUser = await User.findById(userId).select("-password");

    res.status(200).json(blockedUser);
  } catch (error) {
    console.error("Error in blockMessageRequest:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// React to a message
export const reactToMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.userId;

    if (!emoji) {
      return res.status(400).json({
        message: "Emoji is required",
      });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    // Check if the user has already reacted
    const existingReaction = message.reactions.find(
      (reaction) => reaction.user.toString() === userId.toString()
    );

    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      message.reactions.push({
        user: userId,
        emoji,
      });
    }

    await message.save();

    res.status(200).json({
      message: "Reaction added successfully",
      reactions: message.reactions,
    });
  } catch (error) {
    console.error("Error in reactToMessage:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.userId;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const forwardMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params; // the original message being forwarded
    const { receiverIds } = req.body;
    const senderId = req.userId;

    if (!Array.isArray(receiverIds) || receiverIds.length === 0) {
      return res.status(400).json({ error: "receiverIds must be a non-empty array" });
    }

    const originalMessage = await Message.findById(messageId);

    if (!originalMessage) {
      return res.status(404).json({ error: "Original message not found" });
    }

    // Only someone who was part of the original conversation can forward it
    const isParticipant =
      originalMessage.senderId.toString() === senderId ||
      originalMessage.receiverId.toString() === senderId;

    if (!isParticipant) {
      return res.status(403).json({ error: "Not authorized to forward this message" });
    }

    // Dedupe recipients and drop the sender forwarding to themself
    const uniqueReceiverIds = [...new Set(receiverIds.map(String))].filter(
      (rid) => rid !== senderId
    );

    if (uniqueReceiverIds.length === 0) {
      return res.status(400).json({ error: "No valid recipients to forward to" });
    }

    const forwardedDocs = uniqueReceiverIds.map((receiverId) => ({
      senderId,
      receiverId,
      text: originalMessage.text,
      image: originalMessage.image,
      isForwarded: true,
      forwardedFrom: originalMessage._id,
    }));

    const savedMessages = await Message.insertMany(forwardedDocs);

    // Real-time delivery to each recipient who's currently online
    const io = req.app.get("io");
    if (io) {
      savedMessages.forEach((msg) => {
        io.to(msg.receiverId.toString()).emit("newMessage", msg);
      });
    }

    res.status(201).json(savedMessages);
  } catch (error) {
    console.error("Error in forwardMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: image || "",
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
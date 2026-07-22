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
    console.error("Error in getUsersForSidebar: ", error.message);
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
    console.error("Error in getMessages: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /messages/requests
// Returns list of users who messaged you but are not in your connections
export const getMessageRequests = async (req, res) => {
  try {
    const myId = req.userId;

    // get current user with their connections and blocked list
    const me = await User.findById(myId).select("connections blockedUsers");

    // find all messages sent TO me
    const messagesReceived = await Message.find({ receiverId: myId }).distinct(
      "senderId",
    );

    // filter out people already in connections or blocked
    const requestSenderIds = messagesReceived.filter(
      (senderId) =>
        !me.connections.some((c) => c.toString() === senderId.toString()) &&
        !me.blockedUsers.some((b) => b.toString() === senderId.toString()) &&
        senderId.toString() !== myId.toString(),
    );

    // get user details for each request sender
    const requestSenders = await User.find({
      _id: { $in: requestSenderIds },
    }).select("-password");

    res.status(200).json(requestSenders);
  } catch (error) {
    console.error("Error in getMessageRequests:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /messages/requests/accept/:userId
// Accept a message request — adds user to connections
export const acceptMessageRequest = async (req, res) => {
  try {
    const myId = req.userId;
    const { userId } = req.params;

    // add each other to connections
    await User.findByIdAndUpdate(myId, {
      $addToSet: { connections: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: myId },
    });

    // return the accepted user's info
    const acceptedUser = await User.findById(userId).select("-password");

    res.status(200).json(acceptedUser);
  } catch (error) {
    console.error("Error in acceptMessageRequest:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /messages/requests/block/:userId
// Block a user — removes their messages and blocks them
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

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId;

    let imageUrl;
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
    console.error("Error in sendMessage: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

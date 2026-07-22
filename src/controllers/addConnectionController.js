import User from "../models/userModel.js";

export const addConnection = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { targetUserId } = req.body;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { connections: targetUserId },
    });

    return res.status(200).json({ message: "Connection added successfully" });
  } catch (error) {
    console.error("Error in addConnection:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

import User from "../models/userModel.js"; // Adjust the path based on your folder structure

export const addConnection = async (req, res) => {
  try {
    // FIX: Read req.userId directly from your middleware
    const currentUserId = req.userId; 
    const { targetUserId } = req.body;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { connections: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { connections: currentUserId }
    });

    return res.status(200).json({ message: "Connection added successfully" });
  } catch (error) {
    console.error("Error in addConnection:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

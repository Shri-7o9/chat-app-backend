// Remove/Unfriend a user connection
// ADD THIS LINE AT THE VERY TOP OF YOUR CONTROLLER FILE:
import User from "../models/userModel.js"; 

export const removeConnection = async (req, res) => {
  try {
    const currentUserId = req.userId || req.user?._id; // Get logged-in user safely
    const { targetUserId } = req.body; // Target user to remove

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID is required" });
    }

    // 1. Pull target user from current user's connections array
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { connections: targetUserId }
    });

    // 2. Pull current user from target user's connections array (mutual removal)
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { connections: currentUserId }
    });

    return res.status(200).json({ message: "Connection removed successfully" });
  } catch (error) {
    console.error("Error in removeConnection:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

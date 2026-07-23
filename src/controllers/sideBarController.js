import User from "../models/userModel.js"; // Adjust the path based on your folder structure


export const getSidebarUsers = async (req, res) => {
  try {
    // FIX: Read req.userId directly from your middleware
    const currentUserId = req.userId; 

    const userWithConnections = await User.findById(currentUserId)
      .populate("connections", "fullName userName email profilePic");

    if (!userWithConnections) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userWithConnections.connections);
  } catch (error) {
    console.error("Error in getSidebarUsers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

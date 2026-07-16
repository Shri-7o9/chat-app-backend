import User from "../models/userModel.js";

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.userId || req.user?._id; // Get logged-in user safely

    if (!q || !q.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchText = q.trim();

    // 1. First, fetch the logged-in user to see who they are already connected with
    const currentUserDoc = await User.findById(currentUserId).select("connections");
    const connectionIds = currentUserDoc?.connections || [];

    // 2. Search database with exclusions
    const matchingUsers = await User.find({
      _id: { $ne: currentUserId }, // <-- FIX 1: Exclude the logged-in user from results
      $or: [
        // { fullName: { $regex: searchText, $options: "i" } },
        { userName: { $regex: searchText, $options: "i" } },
        // { email: { $regex: searchText, $options: "i" } },
      ],
    }).select("-password -resetPasswordToken -resetPasswordExpires");

    // 3. FIX 2: Map through results and flag who is already connected
    const users = matchingUsers.map((user) => {
      // Convert to a plain JS object so we can append custom properties
      const userObj = user.toObject();
      
      // Check if this user's _id exists inside the current user's connections array
      userObj.alreadyAdded = connectionIds.some(
        (connId) => connId.toString() === user._id.toString()
      );
      
      return userObj;
    });

    return res.status(200).json({
      message: "Users found",
      users,
    });
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

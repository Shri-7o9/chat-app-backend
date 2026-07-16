import User from "../models/userModel.js";

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    // Check if search query is provided
    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const searchText = q.trim();

    const users = await User.find({
      $or: [
        // { fullName: { $regex: searchText, $options: "i" } },
        { userName: { $regex: searchText, $options: "i" } },
        // { email: { $regex: searchText, $options: "i" } },
      ],
    }).select("-password -resetPasswordToken -resetPasswordExpires");

    return res.status(200).json({
      message: "Users found",
      users,
    });
  } catch (error) {
    console.error("Error in searchUsers:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


import User from "../models/userModel.js";

export const authCheck = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Authenticated",
      user,
    });
  } catch (error) {
    console.error("Error in authCheck:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

export const updateUser = async (req, res) => {
  try {
    const { fullName, userName, profilePic } = req.body;

    const userId = req.userId;

    const updateData = { fullName, userName };

    // profilePic is expected as a base64 data URL from the client
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "chat-app-profile-pics",
      });
      updateData.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
     returnDocument: 'after',
    }).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Update profile error:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};

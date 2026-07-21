import User from "../models/userModel.js";
import { uploadToCloudinary } from "./userController.js";
import cloudinary from "../libs/cloudinary.js";


export const updateUser = async (req, res) => {
  try {
    console.log("Update user API hit");

    const userId = req.user._id || req.user.id;
    console.log("User ID:", userId);

    console.log("Body:", req.body);
    console.log("File:", req.file ? req.file.originalname : "No file received");

    const { firstName, lastName, username } = req.body;

    const user = await User.findById(userId);
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;

    if (req.file) {
      console.log("Starting Cloudinary upload...");

      if (user.cloudinaryId) {
        console.log("Deleting old Cloudinary image...");
        await cloudinary.uploader.destroy(user.cloudinaryId);
      }

      const result = await uploadToCloudinary(req.file.buffer);

      console.log("Cloudinary upload completed:", result.secure_url);

      user.profilePic = result.secure_url;
      user.cloudinaryId = result.public_id;
    }

    await user.save();
    console.log("User saved successfully");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};
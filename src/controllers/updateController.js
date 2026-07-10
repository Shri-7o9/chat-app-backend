import User from "../models/userModel.js";
import cloudinary from "../libs/cloudinary.js";
import { uploadToCloudinary } from "./userController.js";

export const updateUser = async (req, res) => {
  try {
  console.log("Update user API hit");//add

    const userId = req.user._id || req.user.id;
    console.log("User ID:", userId);
  //add
    console.log("Body:", req.body);
    console.log("File:", req.file ? req.file.originalname : "No file received");


    const { firstName, lastName } = req.body;

    const user = await User.findById(userId);
    console.log("User found:", user ? "Yes" : "No");//add


    if (!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //update text fields
    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    // if (username) {
    //   user.username = username;
    // }

    //update/change profile picture
    if (req.file) {
      console.log("Starting Cloudinary upload...");
      // Delete the old profile picture from Cloudinary if it exists
      if (user.cloudinaryId) {
        console.log("Deleting old Cloudinary image...");//add
        await cloudinary.uploader.destroy(user.cloudinaryId);
      }

      //upload new img using function from userController.js
      const result = await uploadToCloudinary(req.file.buffer);

      console.log("Cloudinary upload completed:", result.secure_url);//add


      user.profilePic = result.secure_url;
      user.cloudinaryId = result.public_id;
    }

    await user.save();
    console.log("User saved successfully");//add

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        //username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
   return  res.status(500).json({
    success: false,
      message: "Failed to update user",
      error: error.message,
  
    });
  }
};

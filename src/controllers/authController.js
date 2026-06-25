import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/utils.js"
import crypto from "crypto";
 import { generateResetToken } from "../libs/utils.js";


// SIGNUP USER
export const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      userName,
      email,
      password: hashedPassword,
      profilePic: "",
    });

    // check if user created successfully
    if (newUser) {
      generateToken(newUser._id, res);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          userName: newUser.userName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    }

    return res.status(400).json({
      message: "Failed to create user",
    });

  } catch (error) {
  console.log("Error in authController signup", error);
  console.log("",error);


  res.status(500).json({
    message: error.message,
  });
}
    };

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // verify password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate JWT cookie
    if (user) {
      // generate jwt token here
      generateToken(user._id, res);
      await user.save();

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    };

  } catch (error) {
    console.log('Error in login controller:', error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Logout User
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
    });

    res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Check Authentication
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullName, userName } = req.body;
    const userId = req.user._id; // set by protectRoute middleware

    // "ntg send reject" -> Reject if no fields are provided in request body
    if (!fullName && !userName) {
      return res.status(400).json({
        message: "Please provide at least one field to update (fullName or userName)",
      });
    }

    const updateFields = {};

    //  "check fullName" -> If fullName is provided, make sure it is not empty
    if (fullName !== undefined) {
      if (!fullName.trim()) {
        return res.status(400).json({
          message: "Full name cannot be empty",
        });
      }
      updateFields.fullName = fullName.trim();
    }

    // 3. "check not empty-unique" -> If userName is provided, ensure it is not empty and is unique
    if (userName !== undefined) {
      if (!userName.trim()) {
        return res.status(400).json({
          message: "User name cannot be empty",
        });
      }

      // Check if the userName is already in use by another user
      const existingUser = await User.findOne({ userName: userName.trim() });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({
          message: "User name is already taken by another user",
        });
      }
      updateFields.userName = userName.trim();
    }

    // Update user in DB and select all fields except password (".select('-password')")
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in logout controller;", error);
    res.status(500).json({
      message: error.message,
    });
  }
};


//added new lines
// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "INVALID",
      });
    }

    const user = await User.findOne({ email });

    // For security, do not clearly expose whether email exists or not
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset link has been sent",
      });
    }

   
  
    const { rawToken, hashedResetToken, expire } = generateResetToken();

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = expire // 15 minutes 

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;


   await sendEmail({
      to: user.email,
      subject: "ChatApp Password Reset",
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash token from URL and compare it with DB token
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedResetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
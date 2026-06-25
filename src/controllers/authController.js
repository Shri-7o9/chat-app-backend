import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/utils.js";

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

    // create user
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
    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGIN USER

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
    generateToken(user._id, res);

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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGOUT USER

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
    res.status(500).json({
      message: error.message,
    });
  }
};
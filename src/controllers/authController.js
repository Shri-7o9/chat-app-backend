import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../libs/utils.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic: "",
    });

    if (newUser) {
      generateToken(newUser._id, res);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
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


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
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


export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
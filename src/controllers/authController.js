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
  console.log("Error in authController signup", error);
  console.log("",error);


  res.status(500).json({
    message: error.message,
  });
}
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
    console.log("Error in logout controller;", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
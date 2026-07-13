import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../libs/sendEmail.js";


// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    // Check required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }


    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");


    // Create user
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });


    // Verification URL
    const verificationUrl = 
      `http://localhost:5001/api/auth/verify/${verificationToken}`;


    // Send verification email
    await sendEmail({
      email: user.email,
      subject: "Verify your account",
      html: `
        <h2>Hello ${user.firstName}</h2>

        <p>Thanks for registering.</p>

        <p>Please verify your email by clicking the link below:</p>

        <a href="${verificationUrl}">
          Verify Email
        </a>

        <p>This link expires in 24 hours.</p>
      `,
    });


    res.status(201).json({
      success: true,
      message: "User registered. Please check your email for verification.",
    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {

    const { token } = req.params;


    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: {
        $gt: Date.now(),
      },
    });


    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }


    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;


    await user.save();


    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can login now.",
    });


  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// LOGIN (temporary)
export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;


    const user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }


    if(!user.isVerified){
      return res.status(401).json({
        success:false,
        message:"Please verify your email first"
      });
    }


    const isMatch = await user.comparePassword(password);


    if(!isMatch){
      return res.status(401).json({
        success:false,
        message:"Invalid password"
      });
    }


    res.json({
      success:true,
      message:"Login successful"
    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};
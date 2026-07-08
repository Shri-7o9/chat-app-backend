import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import sendMail from "../libs/sendMail.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    try {
      await sendMail({
        email: newUser.email,
        subject: "Welcome to ChatApp! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #4f46e5; text-align: center;">Welcome to ChatApp, ${firstName}! 🎉</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for signing up for ChatApp! We're excited to have you on board.</p>
            <p>You can now start messaging your friends and colleagues in real-time.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
            </div>
            <p>If you have any questions, feel free to reply to this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 ChatApp. All rights reserved.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Failed to send welcome email:", mailError.message);
    }

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error
    });
  }
};

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import sendMail from "../libs/sendMail.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    // Check if all fields are provided
    if (!fullName || !userName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check if username already exists
    const userNameExists = await User.findOne({ userName });

    if (userNameExists) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Respond to the client immediately - don't make them wait on the email.
    // Gmail SMTP can be slow or occasionally throttled, and blocking here risks
    // the request timing out (e.g. a 502 from a proxy) even though signup itself
    // succeeded.
    res.status(201).json({
      message: "User created successfully",
    });

    // Send welcome email in the background - fire and forget.
    sendMail({
      email: newUser.email,
      subject: "Welcome to ChatApp!",
      html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #4f46e5; text-align: center;">Welcome to ChatApp, ${fullName}! </h2>

            <p>Hi ${fullName},</p>

            <p>Thank you for signing up for ChatApp! We're excited to have you on board.</p>

            <p>Your username is <strong>${userName}</strong>.</p>

            <p>You can now start messaging your friends and colleagues in real-time.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Get Started
              </a>
            </div>

            <p>If you have any questions, feel free to reply to this email.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

            <p style="font-size: 12px; color: #777; text-align: center;">
              &copy; 2026 ChatApp. All rights reserved.
            </p>
          </div>
        `,
    }).catch((mailError) => {
      console.error("Failed to send welcome email:", mailError.message);
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
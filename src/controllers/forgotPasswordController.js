import crypto from "crypto";
import User from "../models/userModel.js";
import sendMail from "../libs/sendMail.js";
import { log } from "console";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token and expiry time
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Reset URL
    const resetUrl = `/reset-password/${token}`;

    // Respond to the client immediately - don't make them wait on the email,
    // and only send a single response (a previous version of this code
    // accidentally sent two responses for one request, which crashes with
    // "headers already sent").
    res.status(200).json({
      message: "Password reset email sent successfully",
    });

    // Send email in the background - fire and forget.
    sendMail({
      email: user.email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset Request</h2>

        <p>Hello ${user.fullName},</p>

        <p>You requested to reset your password.</p>

        <p>Click the link below to reset your password:</p>

        <a href="${resetUrl}">
          ${resetUrl}
        </a>

        <p>This link will expire in 10 minutes.</p>

        <p>If you didn't request this, you can ignore this email.</p>
      `,
    }).catch((mailError) => {
      console.error("Failed to send reset email:", mailError.message);
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
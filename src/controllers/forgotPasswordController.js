import crypto from "crypto";
import User from "../models/userModel.js";
import sendMail from "../libs/sendMail.js";

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
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send email
    await sendMail({
      email: user.email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset Request</h2>

        <p>Hello ${user.firstName} ${user.lastName},</p>

        <p>You requested to reset your password.</p>

        <p>Click the link below to reset your password:</p>

        <a href="${resetUrl}">
          ${resetUrl}
        </a>

        <p>This link will expire in 10 minutes.</p>

        <p>If you didn't request this, you can ignore this email.</p>
      `,
    });

    return res.status(200).json({
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
import crypto from "crypto";
import User from "../models/userModel.js";
import sendMail from "../libs/sendMail.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });


    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;


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
      success: true,
      message: "Password reset email sent successfully",
    });


  } catch (error) {

    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
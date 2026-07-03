import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({
        message: "Token is invalid or expired",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

  
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    
    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
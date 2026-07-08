import User from "../models/userModel.js";

export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findOne({ email })
    
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

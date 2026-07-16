import User from "../models/userModel.js";

export const updateUser = async (req, res) => {
  try {
    const { fullName, userName } = req.body;
    
    const userId = req.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        userName
      },
      {
        returnDocument: 'after'
      },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

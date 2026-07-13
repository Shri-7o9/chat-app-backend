import User from "../models/userModel.js";

export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
      },
      {
        returnDocument: "after",
      }
    );

    res.status(200).json(updatedUser);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
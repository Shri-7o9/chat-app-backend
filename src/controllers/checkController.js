import User from "../models/userModel.js";

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(req.userId); 
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

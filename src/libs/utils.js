import jwt from "jsonwebtoken";

// Generates and returns a JWT token for the user
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};
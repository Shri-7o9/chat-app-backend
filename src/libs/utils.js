import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

  // Create a JWT token
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Save the token in a cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
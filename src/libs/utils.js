import jwt from "jsonwebtoken";

// Generates token and sets it in an HttpOnly cookie
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    httpOnly: true, // Prevents XSS attacks (cookie cannot be accessed via client-side JavaScript)
    sameSite: "strict", // Protects against CSRF attacks
    secure: false, 
    // process.env.NODE_ENV !== "development", // Only sends cookie over HTTPS in production
  });

  return token;
};
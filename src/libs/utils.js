import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );


  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });


  return token;
};



export const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");

  const expire = Date.now() + 24 * 60 * 60 * 1000;

  return {
    token,
    expire,
  };
};
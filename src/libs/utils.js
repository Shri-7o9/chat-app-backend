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


 feature/complete-merge
export const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");

  const expire = Date.now() + 24 * 60 * 60 * 1000;

  return {
    token,
    expire,
  };
};


// Encodes the pending signup data (not yet saved to DB) into a signed JWT.
// The token itself carries everything needed to create the user later,
// so nothing is written to the database until the link is clicked.
export const generateSignupToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Decodes/validates a signup token. Throws if invalid or expired.
export const verifySignupToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
 dev-final

import jwt from "jsonwebtoken";

// Generates token and sets it in an HttpOnly cookie
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Prevents XSS attacks (cookie cannot be accessed via client-side JavaScript)
    // Requests are proxied through Vercel (see frontend's vercel.json), so from
    // the browser's perspective this is same-site — "lax" is sufficient and
    // safer than "none". Only switch to "none" if you call this API directly
    // from a different domain without a proxy in front of it.
    sameSite: "lax",
    // Cookie only sent over HTTPS in production; Render/Vercel are both HTTPS.
    secure: isProduction,
  });

  return token;
};
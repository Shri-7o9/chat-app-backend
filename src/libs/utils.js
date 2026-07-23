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
    // "none" is required when the frontend and backend are on different domains
    // (e.g. frontend on Vercel/Netlify, backend on Render). Browsers block
    // "strict"/"lax" cookies in that cross-site setup.
    sameSite: isProduction ? "none" : "lax",
    // "none" cookies are only accepted by browsers when secure:true (HTTPS),
    // which Render provides by default.
    secure: isProduction,
  });

  return token;
};
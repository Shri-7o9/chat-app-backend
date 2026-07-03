import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Get the token from cookies
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // 2. Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // 3. Attach decoded userId to request object
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("JWT Verification error:", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};
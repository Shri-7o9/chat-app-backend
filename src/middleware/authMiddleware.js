import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Get the Authorization header (Format: Bearer <token>)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // 2. Extract the token
    const token = authHeader.split(" ")[1];

    // 3. Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // 4. Attach decoded userId to request object for next handlers
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("JWT Verification error:", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};

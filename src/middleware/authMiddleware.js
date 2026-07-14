import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized - Invalid Token",
      });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("JWT Verification error:", error.message);

    res.status(401).json({
      message: "Unauthorized - Invalid Token",
    });
  }
};

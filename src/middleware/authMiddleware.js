import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Token Provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();

  } catch (error) {
    console.error("JWT Verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid Token"
    });
  }
};
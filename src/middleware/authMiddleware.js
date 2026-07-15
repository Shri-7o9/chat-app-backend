import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
 feature/complete-merge
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Token Provided"

    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token Provided",
dev-final
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

 feature/complete-merge
    req.userId = decoded.id;

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized - Invalid Token",
      });
    }

    req.userId = decoded.userId;
dev-final

    next();

  } catch (error) {
    console.error("JWT Verification error:", error.message);

 feature/complete-merge
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid Token"

    res.status(401).json({
      message: "Unauthorized - Invalid Token",
 dev-final
    });
  }
};

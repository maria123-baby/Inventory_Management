import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in.",
    });
  }

  const token = header.split(" ")[1];

  try {
    // same secret used to sign the token in the login controller
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    const expired = error.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      message: expired
        ? "Session expired. Please log in again."
        : "Invalid token. Please log in again.",
    });
  }
};


export default authMiddleware;
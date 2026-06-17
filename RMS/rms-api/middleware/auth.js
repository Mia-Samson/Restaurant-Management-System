const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
const FALLBACK_SECRET = "dev-secret-key";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    console.log("Primary token verification failed", err.message);
    try {
      req.admin = jwt.verify(token, FALLBACK_SECRET);
      next();
    } catch (fallbackErr) {
      console.log("Fallback token verification failed", fallbackErr.message);
      return res
        .status(401)
        .json({ status: false, message: "Invalid or expired token" });
    }
  }
}

module.exports = authMiddleware;

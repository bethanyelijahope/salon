const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
  }

  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;

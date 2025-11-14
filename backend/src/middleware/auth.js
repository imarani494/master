const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user is inactive."
      });
    }

    // Attach user to request
    req.user = user.toSafeObject();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
      error: error.message
    });
  }
};

module.exports = { authenticate };

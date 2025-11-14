const logger = require("../utils/logger");

// Global error handler
const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    error: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors
    });
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Resource already exists",
      field: err.errors[0].path
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired"
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

// 404 handler
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found"
  });
};

module.exports = { errorHandler, notFound };

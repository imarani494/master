require("dotenv").config();
const http = require("http");
const app = require("./app");
const { sequelize, testConnection } = require("./config/database");
const { initializeSocket } = require("./config/socket");
const { verifyEmailConfig } = require("./config/email");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models (use { force: false } in production)
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    logger.info("✅ Database synchronized");

    // Verify email configuration
    await verifyEmailConfig();

    // Start listening
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

startServer();

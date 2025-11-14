const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const leadRoutes = require("./leadRoutes");
const activityRoutes = require("./activityRoutes");
const notificationRoutes = require("./notificationRoutes");
const analyticsRoutes = require("./analyticsRoutes");

// API version prefix
const API_VERSION = process.env.API_VERSION || "v1";

// Mount routes
router.use(`/${API_VERSION}/auth`, authRoutes);
router.use(`/${API_VERSION}/users`, userRoutes);
router.use(`/${API_VERSION}/leads`, leadRoutes);
router.use(`/${API_VERSION}/activities`, activityRoutes);
router.use(`/${API_VERSION}/notifications`, notificationRoutes);
router.use(`/${API_VERSION}/analytics`, analyticsRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "CRM API is running",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

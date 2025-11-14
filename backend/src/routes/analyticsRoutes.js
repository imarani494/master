const express = require("express");
const router = express.Router();
const {
  getDashboardAnalytics,
  getTeamPerformance
} = require("../services/analyticsService");
const { authenticate } = require("../middleware/auth");
const { isAdminOrManager } = require("../middleware/roleCheck");

router.use(authenticate);

// Dashboard analytics
router.get("/dashboard", async (req, res, next) => {
  try {
    const analytics = await getDashboardAnalytics(req.user.id, req.user.role);
    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
});

// Team performance (Admin/Manager only)
router.get("/team-performance", isAdminOrManager, async (req, res, next) => {
  try {
    const performance = await getTeamPerformance();
    res.json({ success: true, data: performance });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

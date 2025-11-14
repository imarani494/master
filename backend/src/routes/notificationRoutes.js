const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require("../controllers/notificationController");
const { authenticate } = require("../middleware/auth");
const { validateUUID } = require("../middleware/validation");

router.use(authenticate);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/:id/read", validateUUID, markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/:id", validateUUID, deleteNotification);

module.exports = router;

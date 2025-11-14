const { Notification } = require("../models");
const { emitToUser } = require("../config/socket");

// Create notification
const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);

    // Emit real-time notification via WebSocket
    emitToUser(notificationData.userId, "new_notification", notification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Bulk create notifications
const createBulkNotifications = async (notifications) => {
  try {
    const createdNotifications = await Notification.bulkCreate(notifications);

    // Emit to each user
    createdNotifications.forEach((notification) => {
      emitToUser(notification.userId, "new_notification", notification);
    });

    return createdNotifications;
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
};

module.exports = {
  createNotification,
  createBulkNotifications
};

const User = require("./User");
const Lead = require("./Lead");
const Activity = require("./Activity");
const Notification = require("./Notification");

// Define associations
User.hasMany(Lead, { foreignKey: "assignedTo", as: "assignedLeads" });
User.hasMany(Lead, { foreignKey: "createdBy", as: "createdLeads" });
User.hasMany(Activity, { foreignKey: "userId", as: "activities" });
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });

Lead.belongsTo(User, { foreignKey: "assignedTo", as: "assignee" });
Lead.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Lead.hasMany(Activity, { foreignKey: "leadId", as: "activities" });

Activity.belongsTo(Lead, { foreignKey: "leadId", as: "lead" });
Activity.belongsTo(User, { foreignKey: "userId", as: "user" });

Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  User,
  Lead,
  Activity,
  Notification
};

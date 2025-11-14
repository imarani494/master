const { Activity, Lead, User } = require("../models");
const { emitToLead } = require("../config/socket");
const notificationService = require("../services/notificationService");
const logger = require("../utils/logger");

// Create activity
const createActivity = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { type, title, description, metadata, scheduledAt } = req.body;

    // Check if lead exists
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // Check permissions
    if (
      req.user.role === "sales_executive" &&
      lead.assignedTo !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Create activity
    const activity = await Activity.create({
      leadId,
      userId: req.user.id,
      type,
      title,
      description,
      metadata,
      scheduledAt
    });

    // Fetch activity with user info
    const createdActivity = await Activity.findByPk(activity.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] }
      ]
    });

    // Emit real-time update
    emitToLead(leadId, "activity_created", { activity: createdActivity });

    // Notify lead assignee if activity created by someone else
    if (lead.assignedTo !== req.user.id) {
      await notificationService.createNotification({
        userId: lead.assignedTo,
        type: "lead_updated",
        title: "New Activity on Lead",
        message: `${req.user.name} added a ${type} to lead ${lead.name}`,
        relatedEntityType: "lead",
        relatedEntityId: leadId
      });
    }

    logger.info(`Activity created: ${activity.id} for lead: ${leadId}`);

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: { activity: createdActivity }
    });
  } catch (error) {
    next(error);
  }
};

// Get activities for a lead
const getActivitiesByLead = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    // Check if lead exists
    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // Check permissions
    if (
      req.user.role === "sales_executive" &&
      lead.assignedTo !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const { count, rows: activities } = await Activity.findAndCountAll({
      where: { leadId },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] }
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update activity
const updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    // Only creator can update activity
    if (activity.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    await activity.update(updates);

    // Fetch updated activity
    const updatedActivity = await Activity.findByPk(id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] }
      ]
    });

    // Emit real-time update
    emitToLead(activity.leadId, "activity_updated", {
      activity: updatedActivity
    });

    logger.info(`Activity updated: ${id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: "Activity updated successfully",
      data: { activity: updatedActivity }
    });
  } catch (error) {
    next(error);
  }
};

// Delete activity
const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    // Only creator or admin can delete
    if (activity.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    await activity.destroy();

    logger.info(`Activity deleted: ${id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: "Activity deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createActivity,
  getActivitiesByLead,
  updateActivity,
  deleteActivity
};

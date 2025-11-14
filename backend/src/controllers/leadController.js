const { Lead, User, Activity } = require("../models");
const { emitToUser, emitToLead } = require("../config/socket");
const notificationService = require("../services/notificationService");
const emailService = require("../services/emailService");
const logger = require("../utils/logger");
const { Op } = require("sequelize");

// Create new lead
const createLead = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      position,
      source,
      estimatedValue,
      priority,
      notes,
      assignedTo
    } = req.body;

    // Determine assignee
    const assigneeId = assignedTo || req.user.id;

    // Create lead
    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      position,
      source,
      estimatedValue,
      priority,
      notes,
      assignedTo: assigneeId,
      createdBy: req.user.id,
      status: "new"
    });

    // Create activity log
    await Activity.create({
      leadId: lead.id,
      userId: req.user.id,
      type: "status_change",
      title: "Lead created",
      description: `Lead created with status: new`
    });

    // Send notification if assigned to someone else
    if (assigneeId !== req.user.id) {
      await notificationService.createNotification({
        userId: assigneeId,
        type: "lead_assigned",
        title: "New Lead Assigned",
        message: `${req.user.name} assigned you a new lead: ${name}`,
        relatedEntityType: "lead",
        relatedEntityId: lead.id
      });

      // Send email notification
      const assignee = await User.findByPk(assigneeId);
      await emailService.sendLeadAssignedEmail(assignee, lead, req.user);
    }

    // Fetch lead with associations
    const createdLead = await Lead.findByPk(lead.id, {
      include: [
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] }
      ]
    });

    logger.info(`Lead created: ${lead.id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: { lead: createdLead }
    });
  } catch (error) {
    next(error);
  }
};

// Get all leads with filters and pagination
const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      assignedTo,
      search,
      sortBy = "createdAt",
      sortOrder = "DESC"
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    // Role-based filtering
    if (req.user.role === "sales_executive") {
      where.assignedTo = req.user.id;
    } else if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;

    // Search functionality
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Fetch leads
    const { count, rows: leads } = await Lead.findAndCountAll({
      where,
      include: [
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        leads,
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

// Get single lead by ID
const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id, {
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "name", "email", "role"]
        },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        {
          model: Activity,
          as: "activities",
          include: [
            { model: User, as: "user", attributes: ["id", "name", "email"] }
          ],
          order: [["createdAt", "DESC"]]
        }
      ]
    });

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

    res.json({
      success: true,
      data: { lead }
    });
  } catch (error) {
    next(error);
  }
};

// Update lead
const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lead = await Lead.findByPk(id);

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

    // Track status change
    if (updates.status && updates.status !== lead.status) {
      await Activity.create({
        leadId: lead.id,
        userId: req.user.id,
        type: "status_change",
        title: "Status updated",
        description: `Status changed from ${lead.status} to ${updates.status}`
      });

      // Notify assignee
      if (lead.assignedTo !== req.user.id) {
        await notificationService.createNotification({
          userId: lead.assignedTo,
          type: "lead_updated",
          title: "Lead Status Updated",
          message: `${req.user.name} updated lead ${lead.name} status to ${updates.status}`,
          relatedEntityType: "lead",
          relatedEntityId: lead.id
        });
      }
    }

    // Track assignment change
    if (updates.assignedTo && updates.assignedTo !== lead.assignedTo) {
      await Activity.create({
        leadId: lead.id,
        userId: req.user.id,
        type: "assignment",
        title: "Lead reassigned",
        description: `Lead reassigned to new user`
      });

      // Notify new assignee
      const newAssignee = await User.findByPk(updates.assignedTo);
      await notificationService.createNotification({
        userId: updates.assignedTo,
        type: "lead_assigned",
        title: "Lead Assigned to You",
        message: `${req.user.name} assigned you lead: ${lead.name}`,
        relatedEntityType: "lead",
        relatedEntityId: lead.id
      });

      await emailService.sendLeadAssignedEmail(newAssignee, lead, req.user);
    }

    // Update lead
    await lead.update(updates);

    // Emit real-time update
    emitToLead(lead.id, "lead_updated", { lead });

    // Fetch updated lead
    const updatedLead = await Lead.findByPk(id, {
      include: [
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] }
      ]
    });

    logger.info(`Lead updated: ${id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: "Lead updated successfully",
      data: { lead: updatedLead }
    });
  } catch (error) {
    next(error);
  }
};

// Delete lead
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    // Only admin and manager can delete
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    await lead.destroy();

    logger.info(`Lead deleted: ${id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: "Lead deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead
};

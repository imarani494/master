const { User, Lead } = require("../models");
const logger = require("../utils/logger");

// Get all users (Admin/Manager only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive } = req.query;

    const where = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === "true";

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Users can only update themselves unless admin
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Only admin can change roles
    if (updates.role && req.user.role !== "admin") {
      delete updates.role;
    }

    await user.update(updates);

    logger.info(`User updated: ${id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user has assigned leads
    const leadsCount = await Lead.count({ where: { assignedTo: id } });

    if (leadsCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete user with assigned leads. Please reassign leads first."
      });
    }

    await user.destroy();

    logger.info(`User deleted: ${id} by admin: ${req.user.id}`);

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
const getUserStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Users can only view their own stats unless admin/manager
    if (req.user.id !== id && !["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const leadsCount = await Lead.count({ where: { assignedTo: id } });
    const wonLeads = await Lead.count({
      where: { assignedTo: id, status: "won" }
    });
    const lostLeads = await Lead.count({
      where: { assignedTo: id, status: "lost" }
    });
    const activeLeads = await Lead.count({
      where: {
        assignedTo: id,
        status: { [Op.notIn]: ["won", "lost"] }
      }
    });

    res.json({
      success: true,
      data: {
        totalLeads: leadsCount,
        wonLeads,
        lostLeads,
        activeLeads,
        conversionRate:
          leadsCount > 0 ? ((wonLeads / leadsCount) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
};

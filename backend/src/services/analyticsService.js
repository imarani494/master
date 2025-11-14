const { Lead, User, Activity } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

// Get dashboard analytics
const getDashboardAnalytics = async (userId, userRole) => {
  try {
    // Base where clause
    const where = userRole === "sales_executive" ? { assignedTo: userId } : {};

    // Total leads
    const totalLeads = await Lead.count({ where });

    // Leads by status
    const leadsByStatus = await Lead.findAll({
      where,
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"]
      ],
      group: ["status"]
    });

    // Leads by priority
    const leadsByPriority = await Lead.findAll({
      where,
      attributes: [
        "priority",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"]
      ],
      group: ["priority"]
    });

    // Conversion rate
    const wonLeads = await Lead.count({ where: { ...where, status: "won" } });
    const conversionRate =
      totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(2) : 0;

    // Total estimated value
    const totalValue = (await Lead.sum("estimatedValue", { where })) || 0;

    // Recent activities
    const recentActivities = await Activity.findAll({
      include: [
        {
          model: Lead,
          as: "lead",
          where: userRole === "sales_executive" ? { assignedTo: userId } : {},
          attributes: ["id", "name"]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 10
    });

    // Leads created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const leadsThisMonth = await Lead.count({
      where: {
        ...where,
        createdAt: { [Op.gte]: startOfMonth }
      }
    });

    return {
      totalLeads,
      leadsByStatus,
      leadsByPriority,
      conversionRate,
      totalValue: parseFloat(totalValue).toFixed(2),
      recentActivities,
      leadsThisMonth
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};

// Get performance metrics for all users (Admin/Manager)
const getTeamPerformance = async () => {
  try {
    const users = await User.findAll({
      where: { role: "sales_executive", isActive: true },
      attributes: ["id", "name", "email"]
    });

    const performance = await Promise.all(
      users.map(async (user) => {
        const totalLeads = await Lead.count({ where: { assignedTo: user.id } });
        const wonLeads = await Lead.count({
          where: { assignedTo: user.id, status: "won" }
        });
        const totalValue =
          (await Lead.sum("estimatedValue", {
            where: { assignedTo: user.id, status: "won" }
          })) || 0;

        return {
          user: user.toSafeObject(),
          totalLeads,
          wonLeads,
          conversionRate:
            totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(2) : 0,
          totalValue: parseFloat(totalValue).toFixed(2)
        };
      })
    );

    return performance;
  } catch (error) {
    console.error("Error fetching team performance:", error);
    throw error;
  }
};

module.exports = {
  getDashboardAnalytics,
  getTeamPerformance
};

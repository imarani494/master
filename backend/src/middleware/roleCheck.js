// Check if user has required role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions."
      });
    }

    next();
  };
};

// Check if user is admin or manager
const isAdminOrManager = checkRole("admin", "manager");

// Check if user is admin only
const isAdmin = checkRole("admin");

module.exports = {
  checkRole,
  isAdminOrManager,
  isAdmin
};

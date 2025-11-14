const { body, param, validationResult } = require("express-validator");

// Validation middleware wrapper
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }

  next();
};

// User validation rules
const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "manager", "sales_executive"])
    .withMessage("Invalid role"),
  validate
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate
];

// Lead validation rules
const validateLead = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("status")
    .optional()
    .isIn([
      "new",
      "contacted",
      "qualified",
      "proposal",
      "negotiation",
      "won",
      "lost"
    ]),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("estimatedValue")
    .optional()
    .isDecimal()
    .withMessage("Estimated value must be a number"),
  validate
];

// Activity validation rules
const validateActivity = [
  body("type")
    .isIn(["note", "call", "meeting", "email", "status_change", "assignment"])
    .withMessage("Invalid activity type"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().trim(),
  validate
];

// UUID validation
const validateUUID = [
  param("id").isUUID().withMessage("Invalid ID format"),
  validate
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateLead,
  validateActivity,
  validateUUID
};

const { User } = require("../models");
const { generateToken } = require("../utils/jwt");
const logger = require("../utils/logger");

// Register new user
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "sales_executive",
      phone
    });

    // Generate JWT token
    const token = generateToken(user);

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = generateToken(user);

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};

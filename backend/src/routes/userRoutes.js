const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { isAdminOrManager, isAdmin } = require("../middleware/roleCheck");
const { validateUUID } = require("../middleware/validation");

router.use(authenticate);

router.get("/", isAdminOrManager, getAllUsers);
router.get("/:id", validateUUID, getUserById);
router.get("/:id/stats", validateUUID, getUserStats);
router.put("/:id", validateUUID, updateUser);
router.delete("/:id", validateUUID, isAdmin, deleteUser);

module.exports = router;

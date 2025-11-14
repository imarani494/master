const express = require("express");
const router = express.Router();
const {
  createActivity,
  getActivitiesByLead,
  updateActivity,
  deleteActivity
} = require("../controllers/activityController");
const { authenticate } = require("../middleware/auth");
const { validateActivity, validateUUID } = require("../middleware/validation");

router.use(authenticate);

router.post("/lead/:leadId", validateActivity, createActivity);
router.get("/lead/:leadId", getActivitiesByLead);
router.put("/:id", validateUUID, updateActivity);
router.delete("/:id", validateUUID, deleteActivity);

module.exports = router;

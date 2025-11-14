const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Activity = sequelize.define(
  "Activity",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    leadId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "leads",
        key: "id"
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    type: {
      type: DataTypes.ENUM(
        "note",
        "call",
        "meeting",
        "email",
        "status_change",
        "assignment"
      ),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    scheduledAt: {
      type: DataTypes.DATE
    },
    completedAt: {
      type: DataTypes.DATE
    }
  },
  {
    tableName: "activities",
    timestamps: true
  }
);

module.exports = Activity;

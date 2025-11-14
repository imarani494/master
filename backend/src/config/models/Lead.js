const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: /^[0-9+\-\s()]*$/
      }
    },
    company: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM(
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost"
      ),
      defaultValue: "new",
      allowNull: false
    },
    source: {
      type: DataTypes.STRING
    },
    estimatedValue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium"
    },
    notes: {
      type: DataTypes.TEXT
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    }
  },
  {
    tableName: "leads",
    timestamps: true
  }
);

module.exports = Lead;

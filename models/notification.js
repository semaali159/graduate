const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const notification = sequelize.define(
  "notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sourceType: {
      type: DataTypes.ENUM("follow", "event-invite"),
      allowNull: false,
    },
    sourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM(
        "follow-request",
        "follow-accepted",
        "follow-reject",
        "event-invite",
        "event-accepted",
        "event-rejected"
      ),
      allowNull: false,
      defaultValue: "follow-request",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = notification;

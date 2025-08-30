const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/config");

const attendee = sequelize.define("attendee", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    primaryKey: true,
  },
  seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  availableSeats: {
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
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "publicEvents",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  paymentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "payments",
      key: "id",
    },
    onDelete: "CASCADE",
  },
});
module.exports = attendee;

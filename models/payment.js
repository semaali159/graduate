const { DataTypes, INTEGER, UUID } = require("sequelize");
const sequelize = require("../config/config");
const payment = sequelize.define("payment", {
  id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: "usd" },
  status: {
    type: DataTypes.ENUM("pending", "succeeded", "failed"),
    defaultValue: "pending",
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
});
module.exports = payment;

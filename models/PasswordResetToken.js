const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const PasswordResetToken = sequelize.define("password_reset_token", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  consumed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = PasswordResetToken;

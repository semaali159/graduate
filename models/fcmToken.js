const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/config");
const fcmToken = sequelize.define("fcmToken", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  fcmToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = fcmToken;

const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/config");

const userProvinces = sequelize.define("userProvinces", {});
module.exports = userProvinces;

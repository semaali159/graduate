const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/config");

const userInterests = sequelize.define("userInterests", {});
module.exports = userInterests;

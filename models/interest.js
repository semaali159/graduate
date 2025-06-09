const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/config");
const Interest = sequelize.define("interest", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Interest;

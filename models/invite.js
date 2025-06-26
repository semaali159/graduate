const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/config");

const invite = sequelize.define("invite", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    allowNull: false,
    defaultValue: "pending",
  },
});
module.exports = invite;

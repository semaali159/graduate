const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/config");
const relations = sequelize.define("relations", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "user",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "user",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    allowNull: false,
    defaultValue: "pending",
  },
});
module.exports = relations;

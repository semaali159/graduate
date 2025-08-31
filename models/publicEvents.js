const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/config");
const publicEvent = sequelize.define("publicEvent", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  time: {
    type: DataTypes.TIME,
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagePublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  interest: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY("POINT", 4326),
    allowNull: false,
  },
  price: { type: DataTypes.FLOAT, allowNull: false },
  tickets: { type: DataTypes.INTEGER, allowNull: false },
});
module.exports = publicEvent;

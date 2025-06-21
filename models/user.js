const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  otpNum: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  about: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhotoPublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;

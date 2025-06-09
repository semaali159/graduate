const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Province = sequelize.define(
  "Province",
  {
    gid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shape_leng: DataTypes.DOUBLE,
    shape_area: DataTypes.DOUBLE,
    adm1_en: DataTypes.STRING,
    adm1_ar: DataTypes.STRING,
    adm1_pcode: DataTypes.STRING,
    adm1_ref: DataTypes.STRING,
    adm1alt1en: DataTypes.STRING,
    adm1alt2en: DataTypes.STRING,
    adm1alt1ar: DataTypes.STRING,
    adm1alt2ar: DataTypes.STRING,
    adm0_en: DataTypes.STRING,
    adm0_ar: DataTypes.STRING,
    adm0_pcode: DataTypes.STRING,
    date: DataTypes.DATE,
    validon: DataTypes.DATE,
    validto: DataTypes.DATE,
    boundary: {
      type: DataTypes.GEOMETRY("MULTIPOLYGON", 4326),
      allowNull: false,
    },
  },
  {
    tableName: "provinces",
    timestamps: false,
  }
);

module.exports = Province;

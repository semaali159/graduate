const asyncHandler = require("express-async-handler");
const Province = require("../models/provinces");
const getAllProvinces = asyncHandler(async (req, res) => {
  const provinces = Province.findAll({ attributes: ["adm1_en", "gid"] });
  if (!provinces) {
    return res.status(404).json({ message: "interests not found" });
  }
  return res.status(200).json(provinces);
});
module.exports = getAllProvinces;

const asyncHandler = require("express-async-handler");
const Province = require("../../models/provinces");
const getAllProvinces = asyncHandler(async (req, res) => {
  // { attributes: ["adm1_en", "gid"] }
  const provinces = await Province.findAll({ attributes: ["adm1_en", "gid"] });
  console.log(provinces);
  if (!provinces) {
    return res
      .status(404)
      .json({ message: "No provinces found in the database" });
  }
  return res.status(200).json(provinces);
});
module.exports = getAllProvinces;

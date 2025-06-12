const asyncHandler = require("express-async-handler");
const db = require("../models");
const { Op } = require("sequelize");
const searchByName = asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Please provide a name to search." });
  }

  const events = await db.publicEvent.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
  });
  if (!events) {
    return res.status(404).json({ message: "events not found" });
  }
  return res.status(200).json({ message: "events", events });
});
module.exports = { searchByName };

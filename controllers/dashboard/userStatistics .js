const { Op, Sequelize } = require("sequelize");
const asyncHandler = require("express-async-handler");
const db = require("../../models");
const getUsersCount = asyncHandler(async (req, res) => {
  const count = await db.user.count();

  return res.status(200).json({
    usersCount: count,
  });
});
module.exports = { getUsersCount };

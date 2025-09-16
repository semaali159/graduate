const { Op, Sequelize } = require("sequelize");
const asyncHandler = require("express-async-handler");
const db = require("../../models");
const calculateAttendanceRate = require("../../utils/attendeeRateCal");
const getUsersCount = asyncHandler(async (req, res) => {
  const count = await db.user.count();

  return res.status(200).json({
    usersCount: count,
  });
});
const getEarnings = asyncHandler(async (req, res) => {
  const payment = await db.payment.sum("amount", {
    where: { status: "succeeded" },
  });
  if (payment === null) {
    return res.status(404).json({ message: "there is no earnings yet" });
  }
  return res.status(200).json({ earnings: payment });
});
const getAllUesers = asyncHandler(async (req, res) => {
  const users = await db.user.findAll({
    attributes: ["name", "email", "phoneNumber", "isVerified"],
  });
  if (!users) {
    return res.status(404).json({ message: "users not found" });
  }
  return res.status(200).json({ message: "users:", users });
});
const attendeeRate = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const attendeeRate = await calculateAttendanceRate(eventId);
  console.log(attendeeRate);
  if (!attendeeRate) {
    return res.status(404).json({ message: "there is not attendee now" });
  }
  return res.status(200).json({ attendeeRate: attendeeRate });
});
const getUsersWithEvents = asyncHandler(async (req, res) => {
  const totalUsers = await db.user.count();

  if (totalUsers === 0) {
    return res.status(404).json({ message: "user not found" });
  }

  const usersWithEvents = await db.user.count({
    include: [
      {
        model: db.publicEvent,
        required: true,
      },
    ],
    distinct: true,
  });
  console.log(usersWithEvents);
  console.log(totalUsers);

  const percentage = ((usersWithEvents / totalUsers) * 100).toFixed(2);

  return res.status(200).json({
    percentage: `${percentage}%`,
  });
});

module.exports = {
  getUsersCount,
  getAllUesers,
  getEarnings,
  attendeeRate,
  getUsersWithEvents,
};

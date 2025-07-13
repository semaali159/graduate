const asyncHandler = require("express-async-handler");
const db = require("../../models");
const { Op, Sequelize } = require("sequelize");
const getUpcomingEvents = asyncHandler(async (req, res) => {
  const now = new Date();
  const events = await db.publicEvent.findAll({
    where: {
      date: {
        [Op.gt]: now,
      },
    },
    attributes: ["name", "id", "image"],
    include: [
      {
        model: db.user,
        attributes: ["id", "name"],
      },
    ],
    order: [["date", "DESC"]],
    limit: 4,
  });

  if (events.length === 0) {
    return res.status(404).json({ message: "No upcoming events found" });
  }
  attende = 70;

  return res.status(200).json({ message: "Upcoming events", events, attende });
});

const getPastEvents = asyncHandler(async (req, res) => {
  const now = new Date();
  const events = await db.publicEvent.findAll({
    where: {
      date: {
        [Op.lt]: now,
      },
    },
    include: [
      {
        model: db.user,
        attributes: ["id", "name", "image"],
      },
    ],
    order: [["date", "DESC"]],
    limit: 4,
  });

  if (events.length === 0) {
    return res.status(404).json({ message: "no events found" });
  }
  attendes = 100;
  return res.status(200).json({ message: "Past events", events, attendes });
});
module.exports = { getUpcomingEvents, getPastEvents };

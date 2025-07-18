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
const getEventCount = asyncHandler(async (req, res) => {
  const count = await db.publicEvent.count();

  return res.status(200).json({
    eventsCount: count,
  });
});
const getEventGroupByLocaion = asyncHandler(async (req, res) => {
  const [results, metadata] = await db.sequelize.query(`
  SELECT 
    p.adm1_en AS province_name,
    COUNT(e.id) AS event_count
  FROM provinces p
  LEFT JOIN "publicEvents" e 
    ON ST_Contains(p.boundary, e.location)
  GROUP BY p.adm1_en
  ORDER BY event_count DESC;
`);
  // console.log(metadata);
  return res.status(200).json({
    results,
  });
});
module.exports = {
  getUpcomingEvents,
  getPastEvents,
  getEventCount,
  getEventGroupByLocaion,
};

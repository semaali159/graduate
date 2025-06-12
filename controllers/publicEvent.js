const asyncHandler = require("express-async-handler");
const db = require("../models");
const { Op } = require("sequelize");
const createEvent = asyncHandler(async (req, res) => {
  const { name, date, tickets, price, interest, location, image } = req.body;
  const event = await db.publicEvent.create({
    image,
    name,
    location,
    date,
    tickets,
    price,
    interest,
    description: "enjoi",
    userId: req.user.id,
  });
  return res.status(201).json({ message: "event added successfully", event });
});
const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await db.publicEvent.findByPk(id, {
    include: [{ model: db.user, attributes: ["id", "name", "image"] }],
  });
  if (!event) {
    return res.status(404).json({ message: "event not found" });
  }
  return res.status(200).json({ message: "events: ", event });
});
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await db.publicEvent.findAll({
    attributes: ["id", "name", "image"],
  });
  if (!events) {
    return res.status(404).json({ message: "events not found" });
  }
  return res.status(200).json({ message: "events: ", events });
});
const getUpcomingEvents = asyncHandler(async (req, res) => {
  const now = new Date();
  const events = await db.publicEvent.findAll({
    where: {
      date: {
        [Op.gt]: now,
      },
    },
    include: [
      {
        model: db.user,
        attributes: ["id", "name", "image"],
      },
    ],
  });

  if (!events) {
    return res.status(404).json({ message: "No upcoming events found" });
  }

  return res.status(200).json({ message: "Upcoming events", events });
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
  });

  if (!events) {
    return res.status(404).json({ message: "no events found" });
  }

  return res.status(200).json({ message: "Past events", events });
});
const getEventByUserInterest = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userWithInterests = await db.user.findByPk(userId, {
    include: [
      {
        model: db.interest,
        as: "interests",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!userWithInterests || userWithInterests.interests.length === 0) {
    return res.status(404).json({ message: "no interests found" });
  }

  if (userWithInterests.interests.length === 0) {
    return res.status(404).json({ message: "no interests found" });
  }
  console.log(userWithInterests.interests);
  console.log("*****");
  console.log(userWithInterests.interests.name);
  const interestNames = userWithInterests.interests.map((i) => {
    console.log("*****");
    console.log(i.name);
    return i.name;
  });
  console.log(interestNames);
  const events = await db.publicEvent.findAll({
    where: {
      interest: interestNames,
    },
  });
  if (events.length === 0) {
    return res.status(404).json({ message: "no events found" });
  }
  return res.status(200).json({ message: "events by user's interest", events });
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  getPastEvents,
  getEventByUserInterest,
};

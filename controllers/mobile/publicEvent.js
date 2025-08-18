const asyncHandler = require("express-async-handler");
const db = require("../../models");
const { Op, Sequelize } = require("sequelize");
const { cloudinaryUploadBuffer } = require("../../utils/cloudinaryHelpers");
const createEvent = asyncHandler(async (req, res) => {
  const { name, date, tickets, price, interest, location, description } =
    req.body;
  const parsedLocation = JSON.parse(location);

  if (!req.file) {
    return res.status(400).json({ message: "Event image is required" });
  }

  const result = await cloudinaryUploadBuffer(req.file.buffer, "event_photos");

  const event = await db.publicEvent.create({
    image: result.secure_url,
    imagePublicId: result.public_id,
    name,
    location: parsedLocation,
    description,
    date,
    tickets,
    price,
    interest,
    userId: req.user.id,
  });

  return res.status(201).json({
    message: "Event created successfully",
    event,
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;
  const offset = (page - 1) * pageSize;

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
  const view = req.query.view || "mobile"; // default = mobile
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const { count, rows: events } = await db.publicEvent.findAndCountAll({
    offset,
    limit: pageSize,
    // order: [["date", "ASC"]],
  });

  if (!events || events.length === 0) {
    return res.status(404).json({ message: "events not found" });
  }

  let result;
  if (view === "dashboard") {
    result = events.map((e) => ({
      id: e.id,
      name: e.name,
      image: e.image,
      date: e.date,
      // attendees: e.attendee,
    }));
  } else {
    result = events.map((e) => ({
      id: e.id,
      name: e.name,
      image: e.image,
      date: e.date,
      location: e.location?.coordinates,
    }));
  }

  return res.status(200).json({
    message: "events",
    pagination: {
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      pageSize,
    },
    result,
  });
});

// const getAllEvents = asyncHandler(async (req, res) => {
//   const view = req.query.view || "mobile";
//   const events = await db.publicEvent.findAll({});
//   if (!events) {
//     return res.status(404).json({ message: "events not found" });
//   }
//   let result;
//   if (view === "dashboard") {
//     result = events.map((e) => ({
//       id: e.id,
//       name: e.name,
//       image: e.image,
//       date: e.date,
//       // attendees: e.attendee,
//     }));
//   } else {
//     result = events.map((e) => ({
//       id: e.id,
//       name: e.name,
//       image: e.image,
//       date: e.date,
//       location: e.location.coordinates,
//     }));
//   }
//   return res.status(200).json({ message: "events: ", result });
// });
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

  if (events.length === 0) {
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

  const interestNames = userWithInterests.interests.map((i) => {
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
const getUserEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userEvent = await db.publicEvent.findAll({ where: { userId: id } });
  if (!userEvent) {
    return res.status(404).json({ message: "user hasn't any events" });
  }
  return res.status(200).json({ message: "user's event", userEvent });
});
const getEventByUserLocations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const userLocation = await db.user.findByPk(userId, {
    include: [
      {
        model: db.province,
        as: "province",
        attributes: ["gid"],
        through: { attributes: [] },
      },
    ],
  });

  if (!userLocation || userLocation.length === 0) {
    return res.status(404).json({ message: "this location not allowed" });
  }

  const provinceIds = userLocation.province.map((i) => i.gid);

  const provinces = await db.province.findAll({
    where: { gid: provinceIds },
    attributes: ["boundary"],
  });
  // console.log(provinces);
  if (!provinces || provinces.length === 0) {
    return res.status(404).json({ message: "this location not allowed" });
  }

  let allEvents = [];

  for (const province of provinces) {
    const geoJSON = JSON.stringify(province.boundary);
    const events = await db.publicEvent.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          "ST_Contains",
          Sequelize.fn("ST_GeomFromGeoJSON", geoJSON),
          Sequelize.col("location")
        ),
        true
      ),
    });
    allEvents = allEvents.concat(events);
  }

  res.json(allEvents);
});
module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  getPastEvents,
  getEventByUserInterest,
  getUserEvent,
  getEventByUserLocations,
};

const asyncHandler = require("express-async-handler");
const db = require("../../models");
const { Op } = require("sequelize");
const moment = require("moment");

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
const filterEvents = asyncHandler(async (req, res) => {
  const { interest, date, priceMin, priceMax, province } = req.query;

  const whereClause = {};

  if (interest) {
    whereClause.interest = {
      [Op.in]: Array.isArray(interest) ? interest : [interest],
    };
  }

  if (date) {
    whereClause.date = {
      [Op.between]: [
        moment(date).startOf("day").toDate(),
        moment(date).endOf("day").toDate(),
      ],
    };
  }

  if (priceMin || priceMax) {
    whereClause.price = {};
    if (priceMin) whereClause.price[Op.gte] = parseFloat(priceMin);
    if (priceMax) whereClause.price[Op.lte] = parseFloat(priceMax);
  }

  let geoFilter = {};
  if (province) {
    const provinceData = await db.province.findOne({
      where: {
        adm1_en: {
          [Op.iLike]: `%${province}%`,
        },
      },
      attributes: ["boundary"],
    });

    if (!provinceData) {
      return res.status(404).json({ message: "لم يتم العثور على المحافظة" });
    }

    const geoJSON = JSON.stringify(provinceData.boundary);

    geoFilter = {
      location: db.sequelize.where(
        db.sequelize.fn(
          "ST_Contains",
          db.sequelize.fn("ST_GeomFromGeoJSON", geoJSON),
          db.sequelize.col("location")
        ),
        true
      ),
    };
  }

  const events = await db.publicEvent.findAll({
    where: {
      ...whereClause,
      ...geoFilter,
    },
  });

  return res.status(200).json({ message: "filtered events", data: events });
});
const findAttendeeByUsername = asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Please provide a name to search." });
  }

  const attendees = await db.attendee.findAll({
    attributes: ["seats"],
    include: [
      {
        model: db.publicEvent,
        as: "publicEvent",
        attributes: ["name", "date"],
      },
      {
        model: db.user,
        as: "user",
        attributes: ["name", "phoneNumber"],
        where: name
          ? {
              name: { [Op.iLike]: `%${name}%` },
            }
          : undefined,
      },
    ],
  });
  if (attendees.length === 0) {
    return res.status(404).json({ message: "attendees not found" });
  }
  return res.status(200).json({ message: "attendees", attendees });
});
const findUsersByUsername = asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Please provide a name to search." });
  }
  const users = await db.user.findAll({
    attributes: ["name", "email", "phoneNumber", "isVerified"],
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
  });
  if (users.length === 0) {
    return res.status(404).json({ message: "user not found" });
  }
  return res.status(200).json({ message: "users", users });
});
module.exports = {
  searchByName,
  filterEvents,
  findAttendeeByUsername,
  findUsersByUsername,
};

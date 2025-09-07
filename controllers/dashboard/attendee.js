const { Op, Sequelize } = require("sequelize");
const asyncHandler = require("express-async-handler");
const db = require("../../models");
const getAllAttendee = asyncHandler(async (req, res) => {
  const attendeeList = await db.attendee.findAll({
    attributes: ["seats"],
    include: [
      {
        model: db.publicEvent,
        as: "publicEvent", // ⚠️ مهم تحط alias نفسه
        attributes: ["name", "date"],
      },
      {
        model: db.user,
        as: "user", // ⚠️ نفس الشي
        attributes: ["name", "phoneNumber"],
      },
    ],
  });

  if (attendeeList.length == 0) {
    return res.status(404).json({ message: "no attendees found" });
  }
  return res.status(200).json({ message: "attendees", attendeeList });
});
module.exports = { getAllAttendee };

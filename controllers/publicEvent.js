const asyncHandler = require("express-async-handler");
const db = require("../models");
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
  return res.status(201).json({ message: "", event });
});
module.exports = { createEvent };

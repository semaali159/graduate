const asyncHandler = require("express-async-handler");
const Interest = require("../../models/interest");
createInterest = asyncHandler(async (req, res) => {
  const name = req.body.name;
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message: "please enter name",
    });
  }

  let oldInterest = await Interest.findOne({ where: { name } });
  if (oldInterest) {
    return res.status(400).json({ message: "interest already exists" });
  }
  const newInterest = await Interest.create({ name });
  return res.status(201).json(newInterest);
});
getAllInterests = asyncHandler(async (req, res) => {
  const interests = await Interest.findAll();
  if (!interests) {
    return res.status(404).json({ message: "interests not found" });
  }
  return res.status(200).json(interests);
});
getInterestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const interest = await Interest.findByPk(id);
  if (!interest) {
    return res.status(404).json({ message: "interest not found" });
  }
  return res.status(200).json(interest);
});
module.exports = { createInterest, getAllInterests, getInterestById };

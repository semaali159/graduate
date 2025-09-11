const express = require("express");
const {
  searchByName,
  filterEvents,
  findAttendeeByUsername,
} = require("../../controllers/mobile/search");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/name", verifyToken, searchByName);
router.get("/filter", filterEvents);
router.get("/attendee", findAttendeeByUsername);

module.exports = router;

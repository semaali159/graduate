const express = require("express");
const {
  searchByName,
  filterEvents,
  findAttendeeByUsername,
  findUsersByUsername,
} = require("../../controllers/mobile/search");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/name", verifyToken, searchByName);
router.get("/filter", verifyToken, filterEvents);
router.get("/attendee", verifyTokenAndAdmin, findAttendeeByUsername);
router.get("/users", verifyTokenAndAdmin, findUsersByUsername);

module.exports = router;

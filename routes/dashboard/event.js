const {
  getUpcomingEvents,
  getPastEvents,
} = require("../../controllers/dashboard/Event");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/verifyToken");
const express = require("express");
const router = express.Router();
router.get("/upcomingEvent", getUpcomingEvents);
router.get("/pastEvent", getPastEvents);
module.exports = router;

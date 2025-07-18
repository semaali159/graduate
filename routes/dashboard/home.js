const {
  getUpcomingEvents,
  getPastEvents,
  getEventGroupByLocaion,
  getEventCount,
} = require("../../controllers/dashboard/Event");
const {
  getUsersCount,
} = require("../../controllers/dashboard/userStatistics ");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/verifyToken");
const express = require("express");
const router = express.Router();
router.get("/upcomingEvent", verifyTokenAndAdmin, getUpcomingEvents);
router.get("/pastEvent", verifyTokenAndAdmin, getPastEvents);
router.get("/eventByLocation", getEventGroupByLocaion);
router.get("/totalEvents", getEventCount);
router.get("/totalUsers", getUsersCount);
module.exports = router;

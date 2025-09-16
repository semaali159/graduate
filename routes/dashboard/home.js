const {
  getUpcomingEvents,
  getPastEvents,
  getEventGroupByLocaion,
  getEventCount,
  getEventGroupByMonth,
} = require("../../controllers/dashboard/Event");
const {
  getUsersCount,
  getEarnings,
  getUsersWithEvents,
} = require("../../controllers/dashboard/userStatistics");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../../middlewares/verifyToken");
const express = require("express");
const router = express.Router();
router.get("/upcomingEvent", verifyTokenAndAdmin, getUpcomingEvents);
router.get("/pastEvent", verifyTokenAndAdmin, getPastEvents);
router.get("/eventByLocation", verifyTokenAndAdmin, getEventGroupByLocaion);
router.get("/totalEvents", verifyTokenAndAdmin, getEventCount);
router.get("/totalUsers", verifyTokenAndAdmin, getUsersCount);
router.get("/totalEarnings", verifyTokenAndAdmin, getEarnings);
router.get("/eventByMonth", verifyTokenAndAdmin, getEventGroupByMonth);
router.get("/usersWithEvents", verifyTokenAndAdmin, getUsersWithEvents);
module.exports = router;

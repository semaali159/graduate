const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  getPastEvents,
  getEventByUserInterest,
  getUserEvent,
} = require("../controllers/publicEvent");
const {
  verifyToken,
  verifyTokenAndUser,
} = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/", verifyToken, createEvent);
router.get("/", verifyToken, getAllEvents);
router.get("/oneEvent/:id", verifyToken, getEventById);
router.get("/upcomingEvent", verifyToken, getUpcomingEvents);
router.get("/userEvent/:id", verifyTokenAndUser, getUserEvent);
router.get("/pastEvent", verifyToken, getPastEvents);
router.get("/userInterest", verifyToken, getEventByUserInterest);
// router.put("/:id", updatePhotograph);
module.exports = router;

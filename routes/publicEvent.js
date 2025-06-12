const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  getPastEvents,
  getEventByUserInterest,
} = require("../controllers/publicEvent");
const {
  verifyToken,
  verifyTokenAndUser,
} = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/", verifyToken, createEvent);
router.get("/", getAllEvents);
router.get("/oneEvent/:id", getEventById);
router.get("/upcomingEvent", getUpcomingEvents);

router.get("/pastEvent", getPastEvents);
router.get("/userInterest", verifyToken, getEventByUserInterest);
// router.put("/:id", updatePhotograph);
module.exports = router;

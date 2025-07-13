const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  getPastEvents,
  getEventByUserInterest,
  getUserEvent,
  getEventByUserLocations,
} = require("../../controllers/mobile/publicEvent");
const {
  verifyToken,
  verifyTokenAndUser,
} = require("../../middlewares/verifyToken");
const photoUpload = require("../../middlewares/photoUpload");
const router = express.Router();
router.post("/", verifyToken, photoUpload.single("image"), createEvent);
router.get("/", verifyToken, getAllEvents);
router.get("/oneEvent/:id", verifyToken, getEventById);
router.get("/upcomingEvent", verifyToken, getUpcomingEvents);
router.get("/userEvent/:id", verifyTokenAndUser, getUserEvent);
router.get("/pastEvent", verifyToken, getPastEvents);
router.get("/userInterest", verifyToken, getEventByUserInterest);
router.get("/userLocation", verifyToken, getEventByUserLocations);
module.exports = router;

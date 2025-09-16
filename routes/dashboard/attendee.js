const express = require("express");
const { getAllAttendee } = require("../../controllers/dashboard/attendee");
const { verifyTokenAndAdmin } = require("../../middlewares/verifyToken");
const { attendeeRate } = require("../../controllers/dashboard/userStatistics");
const router = express.Router();
router.get("/", verifyTokenAndAdmin, getAllAttendee);
router.get("/attendee-rate/:id", verifyTokenAndAdmin, attendeeRate);
module.exports = router;

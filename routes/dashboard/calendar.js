const express = require("express");
const { getEventForCalendar } = require("../../controllers/dashboard/calendar");
const router = express.Router();
router.get("/", getEventForCalendar);
module.exports = router;

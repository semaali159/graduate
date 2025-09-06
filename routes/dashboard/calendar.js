const express = require("express");
const { getEventForCalendar } = require("../../controllers/dashboard/calendar");
const { verifyTokenAndAdmin } = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/", verifyTokenAndAdmin, getEventForCalendar);
module.exports = router;

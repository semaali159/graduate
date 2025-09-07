const express = require("express");
const { getAllAttendee } = require("../../controllers/dashboard/attendee");
const { verifyTokenAndAdmin } = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/", verifyTokenAndAdmin, getAllAttendee);
module.exports = router;

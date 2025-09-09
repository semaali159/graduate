const express = require("express");
const { getAllUesers } = require("../../controllers/dashboard/userStatistics");
const { verifyTokenAndAdmin } = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/", verifyTokenAndAdmin, getAllUesers);
module.exports = router;

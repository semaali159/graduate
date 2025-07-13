const express = require("express");
const {
  searchByName,
  filterEvents,
} = require("../../controllers/mobile/search");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/name", verifyToken, searchByName);
router.get("/filter", filterEvents);

module.exports = router;

const express = require("express");
const { searchByName } = require("../controllers/search");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();
router.get("/name", verifyToken, searchByName);

module.exports = router;

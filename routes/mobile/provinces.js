const express = require("express");
const province = require("../../controllers/mobile/provinces");
const router = express.Router();
router.get("/", province);
module.exports = router;

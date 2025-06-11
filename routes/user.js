const express = require("express");
const { getAllUsers } = require("../controllers/user");
const router = express.Router();
router.get("/admin", getAllUsers);

module.exports = router;

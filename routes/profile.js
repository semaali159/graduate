const express = require("express");
const { getProfile, updateProfile } = require("../controllers/user");
const router = express.Router();
// router.get("/:id", getProfile);
router.put("/edit/:id", updateProfile);
module.exports = router;

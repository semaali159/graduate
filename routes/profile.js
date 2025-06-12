const express = require("express");
const { getProfile, updateProfile } = require("../controllers/user");
const { verifyTokenAndUser } = require("../middlewares/verifyToken");
const router = express.Router();
router.get("/:id", verifyTokenAndUser, getProfile);
router.put("/edit/:id", updateProfile);
module.exports = router;

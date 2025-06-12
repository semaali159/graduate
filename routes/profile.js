const express = require("express");
const { getProfile, updateProfile } = require("../controllers/user");
const {
  verifyTokenAndUser,
  verifyToken,
} = require("../middlewares/verifyToken");
const router = express.Router();
router.get("/:id", verifyTokenAndUser, getProfile);
router.put("/edit/:id", verifyToken, updateProfile);
module.exports = router;

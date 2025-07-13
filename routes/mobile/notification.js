const express = require("express");
const {
  getAllUserNotification,
} = require("../../controllers/mobile/notification");
const { verifyTokenAndUser } = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/all/:id", verifyTokenAndUser, getAllUserNotification);
module.exports = router;

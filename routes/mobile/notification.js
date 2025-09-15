const express = require("express");
const {
  getAllUserNotification,
  readNotification,
} = require("../../controllers/mobile/notification");
const {
  verifyTokenAndUser,
  verifyToken,
} = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/all/:id", verifyTokenAndUser, getAllUserNotification);
router.put("/read/:id", verifyToken, readNotification);
module.exports = router;

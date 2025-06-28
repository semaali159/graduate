const asyncHandler = require("express-async-handler");
const db = require("../models");
const getAllUserNotification = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const notifications = await db.notification.findAll({
    where: { userId: userId },
  });
  if (notifications.length == 0) {
    return res.status(404).json({ message: "you don't have any notification" });
  }
  return res.status(200).json({ message: "notifications", notifications });
});
module.exports = { getAllUserNotification };

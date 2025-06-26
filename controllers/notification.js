const asyncHandler = require("express-async-handler");
const db = require("../models");
const getAllUserNotification = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const notifications = db.notification.findAll({
    where: { id: userId },
    attributes: [id, sourceId, message, isRead],
  });
  if (notifications.length == 0) {
    return res.status(404).json({ message: "you don't have any notification" });
  }
  return res.status(404).json({ message: "notifications" }, notifications);
});

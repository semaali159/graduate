const asyncHandler = require("express-async-handler");
const db = require("../../models");
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
const readNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  // const notification = await db.notification.findOne(notificationId);
  const [updatedRows] = await db.notification.update(
    { isRead: true },
    { where: { id: notificationId } }
  );

  if (updatedRows === 0) {
    return res.status(404).json({ message: "Notification not found" });
  }

  return res.status(200).json({ message: "Notification marked as read" });
});
module.exports = { getAllUserNotification, readNotification };

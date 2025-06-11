const asyncHandler = require("express-async-handler");
const db = require("../models");
const sendNotification = require("../utils/sendNotification");

const createRequest = asyncHandler(async (req, res) => {
  const { followingId, followerId } = req.body;

  if (!followerId || !followingId) {
    return res
      .status(400)
      .json({ message: "Missing followerId or followingId." });
  }

  const user1 = await db.user.findOne({ where: { id: followingId } });
  const user2 = await db.user.findOne({ where: { id: followerId } });

  if (!user1 || !user2) {
    return res.status(404).json({ message: "User not found." });
  }

  const followRequest = await db.relations.findOne({
    where: { followerId, followingId },
  });

  if (followRequest) {
    return res.status(400).json({ message: "Request already sent!" });
  }

  await db.relations.create({ followingId, followerId });

  const title = `Follow Request`;
  const body = `${user2.name} sent you a follow request`;
  console.log(body);
  // if (Array.isArray(user1.fcmToken)) {
  //   for (const token of user1.fcmToken) {
  //     const success = await sendNotification(token, title, body);
  //     if (success) {
  //       console.log("Notification sent to token:", token);
  //     }
  //   }
  // }

  return res.status(201).json({ message: "Request sent successfully." });
});

const accepteRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await db.relations.findByPk(id);

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }

  await db.relations.update({ status: "accepted" }, { where: { id } });

  const user1 = await db.user.findOne({ where: { id: request.followingId } });
  const user2 = await db.user.findOne({ where: { id: request.followerId } });

  const title = `Follow Request Accepted`;
  const body = `${user1.name} accepted your follow request`;

  // if (Array.isArray(user2.fcmToken)) {
  //   for (const token of user2.fcmToken) {
  //     const success = await sendNotification(token, title, body);
  //     if (success) {
  //       console.log("Notification sent to token:", token);
  //     }
  //   }
  // }
  console.log(body);

  return res.status(200).json({ message: "Request accepted successfully." });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await db.relations.findByPk(id);

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }

  await db.relations.update({ status: "rejected" }, { where: { id } });

  return res.status(200).json({ message: "Request rejected successfully." });
});

module.exports = { createRequest, accepteRequest, rejectRequest };

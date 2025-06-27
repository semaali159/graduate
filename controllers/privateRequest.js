const asyncHandler = require("express-async-handler");
const db = require("../models");
const sendNotification = require("../utils/sendNotification");
const { Sequelize } = require("sequelize");

const createRequest = asyncHandler(async (req, res) => {
  const { followingId, followerId } = req.body;

  if (!followerId || !followingId) {
    return res
      .status(400)
      .json({ message: "Missing followerId or followingId." });
  }

  const user1 = await db.user.findOne({
    where: { id: followingId },
    include: [{ model: db.fcmToken, attributes: ["fcmToken"] }],
  });
  console.log(user1);
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

  const t = await db.sequelize.transaction();
  try {
    const request = await db.relations.create(
      { followingId, followerId },
      { transaction: t }
    );
    console.log(`${user2.name} sent you a follow request`);
    await db.notification.create(
      {
        userId: user1.id,
        type: "follow-request",
        message: `${user2.name} sent you a follow request`,
        senderId: user2.id,
        sourceType: "follow",
        sourceId: request.id,
      },
      { transaction: t }
    );

    await t.commit();
    const title = "Follow Request";
    const body = `${user2.name} sent you a follow request`;
    if (user1.fcmTokens?.length) {
      await Promise.all(
        user1.fcmTokens.map((tokenObj) =>
          sendNotification(tokenObj.fcmToken, title, body)
        )
      );
    }
    return res
      .status(201)
      .json({ message: "Request sent successfully.", request });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
});
const accepteRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  const request = await db.relations.findByPk(id);

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }

  if (request.followingId !== currentUserId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to accept this request." });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request already processed." });
  }

  const t = await db.sequelize.transaction();

  try {
    await db.relations.update(
      { status: "accepted", isRead: true },
      { where: { id }, transaction: t }
    );

    const user1 = await db.user.findOne({
      where: { id: request.followingId },
      // include: ["fcmTokens"],
    });
    const user2 = await db.user.findOne({
      where: { id: request.followerId },
      include: ["fcmTokens"],
    });

    // await db.notification.destroy({
    //   where: {
    //     userId: user2.id,
    //     senderId: user1.id,
    //     type: "follow-request",
    //     sourceId: request.id,
    //   },
    //   transaction: t,
    // });

    await db.notification.create(
      {
        userId: user2.id,
        type: "follow-accepted",
        message: `${user1.name} accepted your follow request`,
        senderId: user1.id,
        sourceType: "follow",
        sourceId: request.id,
      },
      { transaction: t }
    );

    await t.commit();

    const title = `Follow Request Accepted`;
    const body = `${user1.name} accepted your follow request`;

    if (user2.fcmTokens?.length) {
      await Promise.all(
        user2.fcmTokens.map((tokenObj) =>
          sendNotification(tokenObj.fcmToken, title, body)
        )
      );
    }

    return res.status(200).json({ message: "Request accepted successfully." });
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
});

const rejectRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  const request = await db.relations.findByPk(id);

  if (!request) {
    return res.status(404).json({ message: "Request not found." });
  }

  if (request.followingId !== currentUserId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to reject this request." });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request already processed." });
  }

  const t = await db.sequelize.transaction();

  try {
    await db.relations.destroy({ where: { id }, transaction: t });
    await db.notification.destroy({
      where: {
        userId: request.followerId,
        senderId: request.followingId,
        type: "follow-request",
        sourceId: request.id,
      },
      transaction: t,
    });

    await t.commit();

    return res.status(200).json({ message: "Request rejected successfully." });
  } catch (error) {
    await t.rollback();
    return res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
});

module.exports = { createRequest, accepteRequest, rejectRequest };

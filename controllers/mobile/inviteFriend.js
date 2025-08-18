const db = require("../../models");
const asyncHandler = require("express-async-handler");
const sendNotification = require("../../utils/sendNotification");
const { sequelize } = require("../../models");

const inviteFrind = asyncHandler(async (req, res) => {
  const organizerId = req.user.id;
  const eventId = req.params.id;
  const { followers } = req.body;

  if (!Array.isArray(followers) || followers.length === 0) {
    return res.status(400).json({ message: "No followers provided" });
  }

  const event = await db.publicEvent.findByPk(eventId, {
    attributes: ["id", "userId", "name"],
  });

  if (!event || organizerId !== event.userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const organizer = await db.user.findByPk(organizerId);
  const transaction = await sequelize.transaction();

  try {
    await Promise.all(
      followers.map(async (followId) => {
        const alreadyInvited = await db.invite.findOne({
          where: { userId: followId, publicEventId: eventId },
          transaction,
        });

        if (alreadyInvited) return;

        const invite = await db.invite.create(
          { userId: followId, publicEventId: eventId },
          { transaction }
        );

        await db.notification.create(
          {
            sourceType: "event-invite",
            sourceId: invite.id,
            userId: followId,
            type: "event-invite",
            message: `${organizer.name} invited you to an event`,
            isRead: false,
          },
          { transaction }
        );
      })
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Failed to invite followers" });
  }

  const tokens = await db.fcmToken.findAll({
    where: { userId: followers },
    attributes: ["fcmToken"],
    raw: true,
  });
  console.log(tokens);
  const validTokens = tokens.map((t) => t.fcmToken).filter(Boolean);

  const title = "Event Invite";
  const body = `${organizer.name} invited you to the event "${event.name}"`;
  console.log(validTokens);
  // for (const token of validTokens) {
  //   try {
  //     await sendNotification(token, title, body);
  //   } catch (err) {
  //     console.error("Failed to send to token:", token, err);
  //   }
  // }
  if (validTokens.length > 0) {
    await Promise.all(
      validTokens.map((tokenObj) => sendNotification(tokenObj, title, body))
    );
  }
  return res.status(200).json({ message: "Invitations sent successfully" });
});

module.exports = { inviteFrind };

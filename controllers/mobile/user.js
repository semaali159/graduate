const asyncHandler = require("express-async-handler");
const db = require("../../models");
const sequelize = require("../../config/config");
const {
  cloudinaryUploadBuffer,
  cloudinaryRemoveImage,
} = require("../../utils/cloudinaryHelpers");
const { Op } = require("sequelize");
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const userProfile = await db.user.findOne({
    where: {
      id: userId,
    },
    attributes: [
      "id",
      "name",
      "image",
      "about",
      [
        sequelize.literal(`(
      SELECT COUNT(*)
      FROM relations AS follow
      WHERE follow."followingId" = "user"."id" AND follow."status"  = 'accepted'
    )`),
        "followersCount",
      ],
      [
        sequelize.literal(`(
      SELECT COUNT(*)
      FROM relations AS follow
      WHERE follow."followerId" = "user"."id" AND follow."status"  = 'accepted'
    )`),
        "followingCount",
      ],
    ],
  });
  if (!userProfile) {
    return res.status(404).json({ message: "user not found" });
  }
  return res.status(200).json(userProfile);
});

updateProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  const [updateRows] = await db.user.update(updates, {
    where: { id: userId },
  });
  if (updateRows === 0) {
    return res.status(404).json({ error: "user not found" });
  }
  return res.status(200).json({ message: "product updated successfully" });
});
updateUserInterest = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { updatedInterest = [] } = req.body;
  const userData = await db.user.findByPk(userId);
  if (!userData) {
    return res.status(404).json({ error: "user not found" });
  }
  await userData.setInterests(updatedInterest);

  return res.status(200).json({ message: "interests updated successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await db.user.findAll();
  if (!users) {
    return res
      .status(404)
      .json({ message: "No provinces found in the database" });
  }
  return res.status(200).json(users);
});
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await db.user.findOne({
    where: {
      id: userId,
    },
    attributes: [
      "name",
      "image",
      "about",
      [
        sequelize.literal(`(
      SELECT COUNT(*)
      FROM relations AS follow
      WHERE follow."followingId" = "user"."id" AND follow."status"  = 'accepted'
    )`),
        "followersCount",
      ],
      [
        sequelize.literal(`(
      SELECT COUNT(*)
      FROM relations AS follow
      WHERE follow."followerId" = "user"."id" AND follow."status"  = 'accepted'
    )`),
        "followingCount",
      ],
    ],
    include: [
      {
        model: db.publicEvent,
        // as: "createdEvents",
        attributes: ["id", "name", "image"],
      },
    ],
  });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  return res.status(200).json(user);
});

const uploadProfilePhotoCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const result = await cloudinaryUploadBuffer(
    req.file.buffer,
    "profile_photos"
  );
  console.log("ssssssssss");
  console.log("Cloudinary Result:\n", JSON.stringify(result, null, 2));
  const user = await db.user.findByPk(req.user.id);
  console.log("ssssssssss");

  if (user.profilePhotoPublicId) {
    await cloudinaryRemoveImage(user.profilePhotoPublicId);
  }
  console.log("ssssssssss");

  user.image = result.secure_url;
  user.profilePhotoPublicId = result.public_id;
  await user.save();

  res.status(200).json({
    message: "Profile photo uploaded successfully",
    image: user.image,
  });
});
const getUsersInterest = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const userInterest = await db.user.findByPk(userId, {
    include: [
      {
        model: db.interest,
        as: "interests",
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    ],
  });
  if (userInterest.length === 0) {
    res.status(404).json({
      message: "Interests not found",
    });
  }
  res.status(200).json({
    message: "User's interests: ",
    interests: userInterest.interests,
  });
});
const getAllFollowers = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const followers = await db.relations.findAll({
    where: { followingId: id, status: "accepted" },
    attributes: ["followerId"],
  });

  if (!followers || followers.length === 0) {
    return res.status(404).json({ message: "you don't have any follower" });
  }
  const followerIds = followers.map((f) => f.followerId);
  const existFollowers = await db.user.findAll({
    where: { id: { [Op.in]: followerIds } },
    attributes: [
      "id",
      "name",
      "image",
      [
        sequelize.literal(`(
            SELECT COUNT(*)
            FROM relations AS follow
            WHERE follow."followingId" = "user"."id"
                  )`),
        "followersCount",
      ],
    ],
  });

  if (!existFollowers || existFollowers.length === 0) {
    return res.status(404).json({ message: "you don't have any follower" });
  }
  return res.status(200).json({ message: "your followers ", existFollowers });
});
const getAllFollowing = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const followers = await db.relations.findAll({
    where: { followerId: id, status: "accepted" },
    attributes: ["followingId"],
  });

  if (!followers || followers.length === 0) {
    return res.status(404).json({ message: "you don't have any follower" });
  }
  const followerIds = followers.map((f) => f.followingId);
  const existFollowers = await db.user.findAll({
    where: { id: { [Op.in]: followerIds } },
    attributes: [
      "id",
      "name",
      "image",
      [
        sequelize.literal(`(
            SELECT COUNT(*)
            FROM relations AS follow
            WHERE follow."followingId" = "user"."id"
          )`),
        "followersCount",
      ],
    ],
  });

  if (!existFollowers || existFollowers.length === 0) {
    return res.status(404).json({ message: "you don't have any follower" });
  }
  return res.status(200).json({ message: "your followers ", existFollowers });
});
// const getUserById = asyncHandler(async(req))
const saveEvent = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;
  await db.savedEvent.create({
    userId,
    eventId,
  });
  return res.status(201).json({ message: "event saved successfully!" });
});
const unSaveEvent = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;
  await db.savedEvent.destroy({
    where: { userId: userId, eventId: eventId },
  });
  return res.status(200).json({ message: "event unsaved successfully!" });
});
const getAllSavedEvents = asyncHandler(async (req, res) => {
  const events = await db.publicEvent.findAll({
    attributes: ["id", "name", "image", "date", "time"],
    include: [
      {
        model: db.user,
        as: "savers",
        where: { id: req.params.id },
        attributes: [],
        through: { attributes: [] },
      },
    ],
  });

  return res.status(201).json({ message: "your saved events", events });
});
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await db.user.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const deletedRows = await db.user.destroy({ where: { id: userId } });
  if (deletedRows === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "User deleted successfully" });
});
module.exports = {
  saveEvent,
  unSaveEvent,
  getAllSavedEvents,
  getAllUsers,
  updateProfile,
  getUserById,
  getProfile,
  uploadProfilePhotoCtrl,
  getUsersInterest,
  getAllFollowers,
  getAllFollowing,
  updateUserInterest,
  deleteAccount,
};

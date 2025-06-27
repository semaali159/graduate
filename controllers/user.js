const asyncHandler = require("express-async-handler");
const db = require("../models");
const sequelize = require("../config/config");
const {
  cloudinaryUploadBuffer,
  cloudinaryRemoveImage,
} = require("../utils/cloudinaryHelpers");
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
// updateUserInterest = asyncHandler(async (req, res) => {
//   const userId = req.params.id;
//   const { deletedInterest, updatedInterest } = req.body;

//   const [updateRows] = await db.user.update(updates, {
//     where: { id: userId },
//   });
//   if (updateRows === 0) {
//     return res.status(404).json({ error: "user not found" });
//   }
//   return res.status(200).json({ message: "product updated successfully" });
// });getProfile, ,
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
  console.log("ssssssssss");

  const result = await cloudinaryUploadBuffer(req.file.buffer);
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
      sequelize.literal(`(
            SELECT COUNT(*)
            FROM relations AS follow
            WHERE follow."followingId" = "user"."id"
          )`),
    ],
  });

  if (!existFollowers || existFollowers.length === 0) {
    return res.status(404).json({ message: "you don't have any follower" });
  }
  return res.status(200).json({ message: "your followers ", existFollowers });
});
module.exports = {
  getAllUsers,
  updateProfile,
  getUserById,
  getProfile,
  uploadProfilePhotoCtrl,
  getUsersInterest,
  getAllFollowers,
};

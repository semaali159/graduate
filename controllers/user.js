const asyncHandler = require("express-async-handler");
const db = require("../models");
const sequelize = require("../config/config");
const {
  cloudinaryUploadBuffer,
  cloudinaryRemoveImage,
} = require("../utils/cloudinaryHelpers");
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
      WHERE follow."followingId" = "user"."id"
    )`),
        "followersCount",
      ],
      [
        sequelize.literal(`(
      SELECT COUNT(*)
      FROM relations AS follow
      WHERE follow."followerId" = "user"."id"
    )`),
        "followingCount",
      ],
    ],

    include: [
      {
        model: db.interest,
        as: "interests",
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
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

module.exports = {
  getAllUsers,
  updateProfile,
  getUserById,
  getProfile,
  uploadProfilePhotoCtrl,
};

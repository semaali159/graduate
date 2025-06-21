const express = require("express");
const {
  getProfile,
  updateProfile,
  uploadProfilePhotoCtrl,
  getUsersInterest,
} = require("../controllers/user");
const {
  verifyTokenAndUser,
  verifyToken,
} = require("../middlewares/verifyToken");
const photoUpload = require("../middlewares/PhotoUpload");
const router = express.Router();
router.get("/:id", verifyTokenAndUser, getProfile);
router.get("/interests/:id", verifyTokenAndUser, getUsersInterest);
router.put("/edit/:id", verifyToken, updateProfile);
router.post(
  "/image/:id",
  verifyToken,
  photoUpload.single("image"),
  uploadProfilePhotoCtrl
);
module.exports = router;

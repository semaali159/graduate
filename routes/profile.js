const express = require("express");
const {
  getProfile,
  updateProfile,
  uploadProfilePhotoCtrl,
  getUsersInterest,
  getAllFollowers,
} = require("../controllers/user");
const {
  verifyTokenAndUser,
  verifyToken,
} = require("../middlewares/verifyToken");
const photoUpload = require("../middlewares/photoUpload");
const router = express.Router();
router.get("/:id", verifyTokenAndUser, getProfile);
router.get("/interests/:id", verifyTokenAndUser, getUsersInterest);
router.get("/followers/:id", verifyTokenAndUser, getAllFollowers);
router.put("/edit/:id", verifyToken, updateProfile);
router.post(
  "/image/:id",
  verifyToken,
  photoUpload.single("image"),
  uploadProfilePhotoCtrl
);
module.exports = router;

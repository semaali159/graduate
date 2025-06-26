const express = require("express");
const {
  createRequest,
  accepteRequest,
  rejectRequest,
} = require("../controllers/privateRequest");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/", verifyToken, createRequest);
// router.get("/", getAllPhotographs);
// router.get("/:id", getPhotogeaphById);
router.put("/accepte/:id", accepteRequest);
router.put("/reject/:id", rejectRequest);
module.exports = router;

const express = require("express");
const {
  createRequest,
  accepteRequest,
  rejectRequest,
} = require("../controllers/privateRequest");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();
router.post("/", verifyToken, createRequest);
router.put("/accepte/:id", verifyToken, accepteRequest);
router.put("/reject/:id", verifyToken, rejectRequest);
module.exports = router;

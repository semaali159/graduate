const express = require("express");
const { getAllUsers, getUserById } = require("../../controllers/mobile/user");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();
router.get("/admin", getAllUsers);
router.get("/oneUser/:id", verifyToken, getUserById);
module.exports = router;

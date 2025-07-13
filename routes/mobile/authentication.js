const express = require("express");
const {
  Register,
  Login,
  Verification,
} = require("../../controllers/mobile/authentication");
const router = express.Router();
router.post("/register", Register);
router.post("/login", Login);
router.post("/verify", Verification);
module.exports = router;

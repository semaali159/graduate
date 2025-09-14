const express = require("express");
const {
  Register,
  Login,
  Verification,
  GoogleLogin,
} = require("../../controllers/mobile/authentication");
// const verifiy = require("../../controllers/mobile/google");
const router = express.Router();
router.post("/register", Register);
router.post("/login", Login);
router.post("/verify", Verification);
router.post("/google", GoogleLogin);
module.exports = router;

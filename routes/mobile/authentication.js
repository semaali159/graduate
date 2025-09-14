const express = require("express");
const {
  Register,
  Login,
  Verification,
  GoogleLogin,
  CompleteRegister,
} = require("../../controllers/mobile/authentication");
const { verifyTokenAndUser } = require("../../middlewares/verifyToken");

// const verifiy = require("../../controllers/mobile/google");
const router = express.Router();
router.post("/register", Register);
router.post("/login", Login);
router.post("/verify", Verification);
router.post("/google", GoogleLogin);
router.put("/complete-profile/:id", verifyTokenAndUser, CompleteRegister);
module.exports = router;

const express = require("express");
const {
  requestReset,
  verifyResetOtp,
  resetPassword,
} = require("../../controllers/mobile/resetPassword");
const router = express.Router();

router.post("/request-reset", requestReset);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;

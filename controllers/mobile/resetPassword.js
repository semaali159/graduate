const db = require("../../models");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { generateRandomNumber } = require("../../utils/generateOTP");
const sendEmail = require("../../utils/sendEmail");

const requestReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await db.user.findOne({ where: { email } });

  if (!user) {
    return res.status(200).json({ message: "If account exists, OTP sent." });
  }

  const otp = generateRandomNumber(1000, 9999);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.PasswordResetToken.create({
    userId: user.id,
    otp,
    expiresAt,
  });

  try {
    await sendEmail(email, `Your reset code is ${otp}`);
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ message: "Failed to send reset email." });
  }

  return res.status(200).json({ message: "If account exists, OTP sent." });
});

const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await db.user.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "Invalid request." });
  }

  const token = await db.PasswordResetToken.findOne({
    where: { userId: user.id, consumed: false },
    order: [["createdAt", "DESC"]],
  });

  if (!token || token.expiresAt < new Date()) {
    return res.status(400).json({ message: "Code expired or invalid." });
  }

  if (token.otp !== otp) {
    return res.status(400).json({ message: "Invalid code." });
  }

  await token.update({ verified: true });

  return res.status(200).json({ message: "OTP valid", proof: token.id });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, proof } = req.body;

  const user = await db.user.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "Invalid request." });
  }

  const token = await db.PasswordResetToken.findOne({
    where: { id: proof, userId: user.id, verified: true, consumed: false },
  });

  if (!token) {
    return res.status(400).json({ message: "Invalid or expired proof." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.user.update(
    { password: hashedPassword },
    { where: { id: user.id } }
  );

  await token.update({ consumed: true });

  return res.status(200).json({ message: "Password reset successful." });
});

module.exports = { requestReset, verifyResetOtp, resetPassword };

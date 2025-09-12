const express = require("express");
const router = express.Router();
const admin = require("../../config/firebase");
const asyncHandler = require("express-async-handler");
const verifiy = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  console.log(idToken);
  console.log(admin);
  try {
    const decodedToken = await admin.getAuth().verifyIdToken(idToken);
    console.log(decodedToken);

    const { uid, email, name, picture } = decodedToken;

    res.status(200).json({
      success: true,
      user: {
        uid,
        email,
        name: name || "No name provided",
        picture: picture || null,
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ success: false, error: error.message });
  }
});

module.exports = verifiy;

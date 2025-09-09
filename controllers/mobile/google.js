const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
require("dotenv").config();
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

router.post("/verify-token", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

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

module.exports = router;

admin = require("../config/firebase");
async function sendNotification(fcmToken, title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    return true;
  } catch (error) {
    console.log("Error sending message:", error);
    if (
      error.errorInfo.code === "messaging/registration-token-not-registered"
    ) {
      console.log("Invalid FCM token:", fcmToken);
    }
    return false;
  }
}
module.exports = sendNotification;

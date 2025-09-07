const express = require("express");
const sequelize = require("./config/config");
const provinceRoute = require("././routes/mobile/provinces");
const interestRoute = require("././routes/mobile/interest");
const authRoute = require("././routes/mobile/authentication");
const userRoute = require("././routes/mobile/user");
const profileRoute = require("././routes/mobile/profile");
const eventRoute = require("././routes/mobile/publicEvent");
const searchRoute = require("././routes/mobile/search");
const relationRoute = require("././routes/mobile/relation");
const notificationRoute = require("././routes/mobile/notification");
const homeRoute = require("././routes/dashboard/home");
const inviteFriend = require("././routes/mobile/inviteFriend");
const paymentRoute = require("././routes/mobile/payment");
const cors = require("cors");
const handleStripeWebhook = require("./controllers/mobile/stripeWebhook");
const calendarRoute = require("./routes/dashboard/calendar");
const attendeeRoute = require("./routes/dashboard/attendee");
const resetPasswordRoute = require("./routes/mobile/resetPasword");
const app = express();
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*", // origin: 'http://localhost:3000'
  })
);
app.use(cors({ credentials: true, origin: true, withCredentials: true }));

app.use("/api/province", provinceRoute);
app.use("/api/interest", interestRoute);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);
app.use("/api/search", searchRoute);
app.use("/api/follow", relationRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/admin/home", homeRoute);
app.use("/api/admin/calendar", calendarRoute);
app.use("/api/admin/attendee", attendeeRoute);
app.use("/api/invite", inviteFriend);
app.use("/api/payment", paymentRoute);
app.use("/api/reset-password", resetPasswordRoute);

sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced successfully"))
  .catch((error) => console.error("Error syncing database:", error));
app.use(express.static("public"));

app.use("/", (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventPop</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        background-color: #e0e0e0;
      }
      .header {
        height: 100vh;
        background-image: url("https://images.unsplash.com/photo-1579537533965-3875982f3d87?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaW8=&auto=format&fit=crop&w=750&q=80");
        background-size: cover;
        background-position: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .header h1 {
        color: #4169E1;
        font-size: 6rem;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      }
    </style>
  </head>
  <body>
    <div class="header">
      <b><h1>Welcome to our platform, EventPop!</h1></b>
    </div>
  </body>
  </html>
  `);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const sequelize = require("./config/config");
const provinceRoute = require("./routes/provinces");
const interestRoute = require("./routes/interest");
const authRoute = require("./routes/authentication");
const userRoute = require("./routes/user");
const profileRoute = require("./routes/profile");
const eventRoute = require("./routes/publicEvent");
const searchRoute = require("./routes/search");
const relationRoute = require("./routes/relation");
const notificationRoute = require("./routes/notification");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/province", provinceRoute);
app.use("/api/interest", interestRoute);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);
app.use("/api/search", searchRoute);
app.use("/api/follow", relationRoute);
app.use("/api/notification", notificationRoute);
sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced successfully"))
  .catch((error) => console.error("Error syncing database:", error));

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

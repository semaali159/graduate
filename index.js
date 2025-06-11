const express = require("express");
const sequelize = require("./config/config");
const provinceRoute = require("./routes/provinces");
const interestRoute = require("./routes/interest");
const authRoute = require("./routes/authentication");
const userRoute = require("./routes/user");
const profileRoute = require("./routes/profile");
const eventRoute = require("./routes/publicEvent");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/province", provinceRoute);
app.use("/api/interest", interestRoute);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);
sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced successfully"))
  .catch((error) => console.error("Error syncing database:", error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

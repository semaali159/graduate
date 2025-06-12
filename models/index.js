const user = require("./user");
const province = require("./provinces");
const interest = require("./interest");
const userInterests = require("./userInterests");
const userProvinces = require("./userProvinces");
const relations = require("./relations");
const publicEvent = require("./publicEvents");
const fcmToken = require("./fcmToken");

const sequelize = require("../config/config");
user.hasMany(publicEvent, { foreignKey: "userId", onDelete: "CASCADE" });
publicEvent.belongsTo(user, { foreignKey: "userId" });
user.hasMany(fcmToken, { foreignKey: "userId", onDelete: "CASCADE" });
fcmToken.belongsTo(user, { foreignKey: "userId" });
// users have many locations
user.belongsToMany(province, {
  through: userProvinces,
  foreignKey: "userId",
  as: "province",
});

province.belongsToMany(user, {
  through: userProvinces,
  foreignKey: "provinceId",
  as: "user",
});
//users have many interests and interests belongs to many users
user.belongsToMany(interest, {
  through: userInterests,
  foreignKey: "userId",
  as: "interests",
});
interest.belongsToMany(user, {
  through: userInterests,
  foreignKey: "interestId",
  as: "users",
});
user.belongsToMany(user, {
  through: relations,
  as: "followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});
user.belongsToMany(user, {
  through: relations,
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId",
});
module.exports = {
  sequelize,
  user,
  province,
  userInterests,
  interest,
  userProvinces,
  relations,
  publicEvent,
  fcmToken,
};

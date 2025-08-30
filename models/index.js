const user = require("./user");
const province = require("./provinces");
const interest = require("./interest");
const userInterests = require("./userInterests");
const userProvinces = require("./userProvinces");
const relations = require("./relations");
const publicEvent = require("./publicEvents");
const fcmToken = require("./fcmToken");

const sequelize = require("../config/config");
const notification = require("./notification");
const invite = require("./invite");
const attendee = require("./attendee");
const payment = require("./payment");
user.hasMany(publicEvent, { foreignKey: "userId", onDelete: "CASCADE" });
publicEvent.belongsTo(user, { foreignKey: "userId" });
user.hasMany(fcmToken, { foreignKey: "userId", onDelete: "CASCADE" });
fcmToken.belongsTo(user, { foreignKey: "userId" });
user.hasMany(notification, {
  foreignKey: "senderId",
  onDelete: "CASCADE",
  as: "sentNotifications",
});
notification.belongsTo(user, { foreignKey: "senderId", as: "sender" });
user.hasMany(notification, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "receivedNotifications",
});
notification.belongsTo(user, { foreignKey: "userId", as: "receiver" });

notification.belongsTo(relations, {
  foreignKey: "sourceId",
  constraints: false,
  as: "followData",
});

notification.belongsTo(invite, {
  foreignKey: "sourceId",
  constraints: false,
  as: "eventInvite",
});

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
user.belongsToMany(publicEvent, {
  through: invite,
  foreignKey: "userId",
  as: "invitedEvent",
});

publicEvent.belongsToMany(user, {
  through: invite,
  foreignKey: "publicEventId",
  as: "invitedEvent",
});
user.belongsToMany(publicEvent, {
  through: attendee,
  foreignKey: "userId",
  as: "attendingEvent",
});

publicEvent.belongsToMany(user, {
  through: attendee,
  foreignKey: "publicEventId",
  as: "attendees",
});

attendee.hasOne(payment);
payment.belongsTo(attendee);
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
  notification,
  invite,
};

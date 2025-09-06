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
const savedEvent = require("./savedEvent");
//  A user can create many public events
user.hasMany(publicEvent, { foreignKey: "userId", onDelete: "CASCADE" });
publicEvent.belongsTo(user, { foreignKey: "userId" });
//  A user can have multiple FCM tokens
user.hasMany(fcmToken, { foreignKey: "userId", onDelete: "CASCADE" });
fcmToken.belongsTo(user, { foreignKey: "userId" });
// Notifications sent by the user
user.hasMany(notification, {
  foreignKey: "senderId",
  onDelete: "CASCADE",
  as: "sentNotifications",
});
//  Notifications received by the user
notification.belongsTo(user, { foreignKey: "senderId", as: "sender" });
user.hasMany(notification, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "receivedNotifications",
});

notification.belongsTo(user, { foreignKey: "userId", as: "receiver" });
// two type of notification
// Notification can be related to a follow relation
notification.belongsTo(relations, {
  foreignKey: "sourceId",
  constraints: false,
  as: "followData",
});
// Notification can be related to an event invite
notification.belongsTo(invite, {
  foreignKey: "sourceId",
  constraints: false,
  as: "eventInvite",
});

//  A user can belong to many provinces
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
// Followers and following relationship between users
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
//Users can be invited to events
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
//Users can attend events
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
// Each attendee can have one payment record
attendee.hasOne(payment);
payment.belongsTo(attendee);
//Users can save events
user.belongsToMany(publicEvent, {
  through: savedEvent,
  foreignKey: "userId",
  as: "savedEvents",
});
publicEvent.belongsToMany(user, {
  through: savedEvent,
  foreignKey: "eventId",
  as: "savers",
});

module.exports = {
  savedEvent,
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
  attendee,
  payment,
};

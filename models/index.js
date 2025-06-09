const user = require("./user");
const province = require("./provinces");
const interest = require("./interest");
const userInterests = require("./userInterests");
const userProvinces = require("./userProvinces");
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
module.exports = { user, province, userInterests, interest, userProvinces };

const jwt = require("jsonwebtoken");
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateToken(id, isAdmin) {
  return jwt.sign({ id: id, isAdmin: isAdmin }, process.env.JWT_SECRET_KEY);
}

module.exports = { generateRandomNumber, generateToken };

const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");
// Validate Register
function validateRegister(obj) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: passwordComplexity().required(),
    isAdmin: Joi.bool(),
    phoneNumber: Joi.string().required(),
    provinces: Joi.array(),
    interests: Joi.array(),
  });
  return schema.validate(obj);
}

// Validate Login
function validateLogin(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(8).required(),
    fcmToken: Joi.string().required(),
  });
  return schema.validate(obj);
}
module.exports = { validateRegister, validateLogin };

const Joi = require("joi");

// login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email address"),
  password: Joi.string().min(6).max(32).required().label("Password"),
});

module.exports = loginSchema;
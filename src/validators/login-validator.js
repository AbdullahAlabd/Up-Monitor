const Joi = require("joi");

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(32).required(),
});

module.exports = loginSchema;
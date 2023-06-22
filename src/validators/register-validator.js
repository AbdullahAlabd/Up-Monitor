const Joi = require("joi");

// Register validation
const registerSchema = Joi.object({
  name: Joi.string().min(4).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(32).required(),
});

module.exports = registerSchema;
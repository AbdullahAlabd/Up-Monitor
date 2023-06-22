const Joi = require("joi");

// register validation
const registerSchema = Joi.object({
  name: Joi.string().min(4).max(32).required().label("Name"),
  email: Joi.string().email().required().label("Email address"),
  password: Joi.string().min(6).max(32).required(). label("Password"),
});

module.exports = registerSchema;
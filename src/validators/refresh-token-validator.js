const Joi = require("joi");

// refresh token validation
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().label("Refresh Token")
});

module.exports = refreshTokenSchema;

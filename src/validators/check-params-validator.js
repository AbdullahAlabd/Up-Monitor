const Joi = require("joi");

// url-check request body validation (for both get, update and remove)
const checkParams = Joi.object({
  checkId: Joi.string().hex().length(24).label("Check id")
});

module.exports = checkParams;

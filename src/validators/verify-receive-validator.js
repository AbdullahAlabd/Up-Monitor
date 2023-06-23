const Joi = require("joi");

// /verify(get) query parameters validation
const verifyReceiveSchema = Joi.object({
  token: Joi.string()
    .required()
    .trim()
    .label("Token")
});

module.exports = verifyReceiveSchema;

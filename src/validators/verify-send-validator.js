const Joi = require("joi");

// /verify(post) body validation
const verifySendSchema = Joi.object({
  userId: Joi.string().hex().length(24).label("User id")
});

module.exports = verifySendSchema;
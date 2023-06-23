const customError = require("../errors");
const validators = require("../validators");

const validationTarget = Object.freeze({
  BODY: 1, // request body
  PARAM: 2, // path params
  QUERY: 3 // query params
});

const validator = function (validator, target = validationTarget.BODY) {
  if (!validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      let validated;
      switch (target) {
        case validationTarget.BODY:
          validated = await validators[validator].validateAsync(req.body);
          req.body = validated;
          break;
        case validationTarget.PARAM:
          validated = await validators[validator].validateAsync(req.params);
          req.params = validated;
          break;
        case validationTarget.QUERY:
          validated = await validators[validator].validateAsync(req.query);
          req.query = validated;
          break;
      }
      return next();
    } catch (err) {
      if (err.isJoi)
        return next(
          new customError.UnprocessableContentError(
            err.message.replaceAll('"', "")
          )
        );
      return next(
        new customError.InternalServerError(
          "Something went wrong, please try again later"
        )
      );
    }
  };
};

module.exports = { validator, validationTarget };

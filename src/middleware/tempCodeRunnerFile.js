const customError = require("../errors");
const validators = require("../validators");

const validatorMiddleware = function (validator) {
  if (!validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`);

  return async function (req, res, next) {
    try {
      const validated = await validators[validator].validateAsync(req.body);
      req.body = validated;
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

module.exports = validatorMiddleware;

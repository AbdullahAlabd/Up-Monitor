const userModel = require("../models/user-model");
const customError = require("../errors");
const jwt = require("jsonwebtoken");

const authenticatorMiddleware = async (req, res, next) => {
  try {
    if (req.headers?.authorization?.split(" ")[0] === "JWT") {
      const token = req.headers.authorization.split(" ")[1];
      const decode = await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      // TODO: check if decode is enough
      const user = await userModel.findById(decode?.userId);
      if (!user) {
        return next(
          new customError.UnauthenticatedError(
            "Token is either missing or invalid!"
          )
        );
      }
      if (user.verified === false) {
        return next(
          new customError.UnauthenticatedError(
            "Please verify your email first!"
          )
        );
      }
      req.body.userId = user._id; // for authorization
      req.body.role = user.role; // for authorization
      req.body.isVerified = user.verified; // for authorization
      next();
    } else {
      return next(
        new customError.UnauthenticatedError(
          "Token is either missing or invalid!"
        )
      );
    }
  } catch (error) {
    return next(
      new customError.UnauthenticatedError(
        "Token is either missing or invalid!"
      )
    );
  }
};

module.exports = authenticatorMiddleware;

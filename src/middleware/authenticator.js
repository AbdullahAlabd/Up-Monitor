const userModel = require("../models/user-model");
const customError = require("../errors");
const jwt = require("jsonwebtoken");

const authenticatorMiddleware = async (req, res, next) => {
  try {
      const token = req?.headers?.authorization?.split(" ")[1];
      const userPayload = await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      if (userPayload.isVerified === false) {
        return next(
          new customError.UnauthenticatedError(
            "Please verify your email first!"
          )
        );
      }
      req.body.userId = userPayload.userId; // for authorization
      req.body.role = userPayload.role; // for authorization
      req.body.isVerified = userPayload.isVerified; // for authorization
      next();
  } catch (error) {
    return next(
      new customError.UnauthenticatedError(
        "Token is either missing or invalid!"
      )
    );
  }
};

module.exports = authenticatorMiddleware;

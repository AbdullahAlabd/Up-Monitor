const userModel = require("../models/user-model");
const customError = require("../errors");

const jwt = require("jsonwebtoken");

const authenticatorMiddleware = async (req, res, next) => {
  try {
    if (req.headers?.authorization?.split(" ")[0] === "JWT") {
      const token = req.headers.authorization.split(" ")[1];
      const decode = await jwt.verify(token, process.env.SECRET_KEY);
      // TODO: check if decode is enough
      const user = await userModel.findById(decode?.id);
      if (!user) {
        throw new customError.UnauthenticatedError("Token is either missing or invalid!");
      }
      req.body.user = user;
      next();
    } else {
      throw new customError.UnauthenticatedError("Token is either missing or invalid!");
    }
  } catch (error) {
    throw new customError.UnauthenticatedError("Token is either missing or invalid!");
  }
};

module.exports = authenticatorMiddleware;

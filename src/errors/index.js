const CustomApiError = require("./custom-api");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found");
const UnauthenticatedError = require("./unauthenticated");
const UnauthorizedError = require("./unauthorized");
const AlreadyExistsError = require("./already-exists");

module.exports = {
  CustomApiError,
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  AlreadyExistsError
};
